import { inject, injectable } from "inversify";
import { USER_TYPES } from "@infrastructure/inversify_di/features/user/user.types";
import { ISipInstallmentRepository } from "@application/interfaces/repositories/feature/sip-intallment-repository.interface";
import { SipInstallmentEntity } from "@domain/entities/mutual-fund/sip-intallment.entity";
import { ISipRepository } from "@application/interfaces/repositories/feature/sip-repository.interface";
import { SipStatus } from "@domain/enum/funds/sip.enums";
import { IInvestmentRepository } from "@application/interfaces/repositories/feature/investment-repository.interface";
import { InvestmentEntity } from "@domain/entities/mutual-fund/investment.entity";
import { InvestmentType, PaymentMethod } from "@domain/enum/funds/investment.enums";
import { calculateNextExecutionDate } from "@shared/utils/sip/sip-installment.utils";
import { SipEntity } from "@domain/entities/mutual-fund/sip.entity";
import { ITransactionService } from "@application/services/transaction/interfaces/transaction.service.interface";
import { IWalletService } from "@application/services/wallet/interfaces/wallet.service.interface";
import { IUserRepository } from "@application/interfaces/repositories/user/user-repository.interface";
import { IMutualFundRepository } from "@application/interfaces/repositories/feature/mutual-fund-repository.interface";
import mongoose from "mongoose";
import { SIP_TYPES } from "@infrastructure/inversify_di/features/sip/sip.types";
import { MUTUAL_FUND_TYPES } from "@infrastructure/inversify_di/features/mutual-fund/mutual-fund.types";
import { NOTIFICATION_TYEPS } from "@infrastructure/inversify_di/features/notification/notification.type";
import { ICreateNotificationUseCase } from "../notification/interfaces/create-notification-usecase.interface";
import { NotificationType } from "@domain/entities/notification/enums/notification-type.enums";
import { NotFoundError } from "@presentation/express/utils/error-handling";
import { ErrorMessages } from "@shared/constants/error.messages";
import { IWalletRepository } from "@application/interfaces/repositories/user/wallet-repository.interface";
import { IAnalyzeFailedInstallmentsUseCase } from "./interfaces/analyze-failed-installments-usecase.interface";

@injectable()
export class AnalyzeFailedInstallmentsUseCase implements IAnalyzeFailedInstallmentsUseCase {
    constructor(
        @inject(SIP_TYPES.SipInstallmentRepository) private readonly _sipInstallmentRepository: ISipInstallmentRepository,
        @inject(SIP_TYPES.SipRepository) private readonly _sipRepository: ISipRepository,
        @inject(MUTUAL_FUND_TYPES.InvestmentRepository) private readonly _investmentRepository: IInvestmentRepository,
        @inject(MUTUAL_FUND_TYPES.MutualFundRepository) private readonly _mutualfundRepo: IMutualFundRepository,
        @inject(USER_TYPES.UserRepository) private readonly _userRepository: IUserRepository,
        @inject(USER_TYPES.WalletRepository) private readonly _walletRepository: IWalletRepository,
        @inject(NOTIFICATION_TYEPS.CreateNotificationUseCase) private readonly _createNotificationUseCase: ICreateNotificationUseCase,
        @inject(USER_TYPES.TransactionService) private readonly _transactionService: ITransactionService,
        @inject(USER_TYPES.WalletService) private readonly _walletService: IWalletService,
    ) { }

    async execute(): Promise<void> {
        const failedInstallments = await this._sipInstallmentRepository.findFailedInstallmentsForRetry();
        if (!failedInstallments || failedInstallments.length === 0) return;

        for (const installment of failedInstallments) {
            try {
                await this.retrySingleInstallment(installment);
            } catch (error) {
                console.error(`Failed to retry installment ${installment.id}:`, error);
            }
        }
    }

    private async retrySingleInstallment(installment: SipInstallmentEntity): Promise<void> {
        const sip = await this._sipRepository.findById(installment.sipId);
        if (!sip || sip.status !== SipStatus.ACTIVE) return;

        const user = await this._userRepository.findById(installment.userId);
        if (!user) return;

        const fund = await this._mutualfundRepo.findBySchemeCode(installment.schemeCode);
        if (!fund) return;

        const wallet = await this._walletRepository.findOne({ userId: user.id as string });
        if (!wallet) throw new NotFoundError(ErrorMessages.PAYMENT.WALLET_NOT_FOUND);

        const session = await mongoose.startSession();
        try {
            session.startTransaction();

            if ((wallet?.balance ?? 0) < installment.amount) {
                const newRetryCount = (installment.retryCount ?? 0) + 1;

                if (newRetryCount >= 3) {
                    // Pause the SIP
                    const pausedSip = SipEntity.pause(sip);
                    await this._sipRepository.update(pausedSip.id as string, pausedSip, session);

                    await this._sipInstallmentRepository.updateFailedRetry(
                        installment.id as string,
                        "MAX_RETRIES_REACHED",
                        newRetryCount,
                        session
                    );

                    await this._createNotificationUseCase.execute({
                        userId: user.id as string,
                        type: NotificationType.SIP,
                        title: "SIP Paused - Max Retries Reached",
                        message: `Your SIP of ₹${installment.amount} for ${fund.schemeName} has been paused because installment retries reached the maximum limit (3 times) due to insufficient wallet balance. Please add funds and resume your SIP.`,
                    });
                } else {
                    await this._sipInstallmentRepository.updateFailedRetry(
                        installment.id as string,
                        "INSUFFICIENT_BALANCE",
                        newRetryCount,
                        session
                    );

                    await this._createNotificationUseCase.execute({
                        userId: user.id as string,
                        type: NotificationType.SIP,
                        title: `SIP Installment Retry ${newRetryCount} Failed`,
                        message: `Your SIP installment of ₹${installment.amount} failed due to insufficient wallet balance (Retry ${newRetryCount}/3). Please add funds to your wallet to continue.`,
                    });
                }

                await session.commitTransaction();
                return;
            }

            const newTransaction = await this._transactionService.createSipTransaction(
                user,
                installment.amount,
                fund.id as string,
                installment.id as string,
                session
            );

            await this._walletService.debit(wallet, installment.amount, session);

            const investment = InvestmentEntity.create({
                amount: installment.amount,
                investmentType: InvestmentType.SIP,
                paymentMethod: PaymentMethod.WALLET,
                schemeCode: installment.schemeCode,
                userId: installment.userId,
                sipInstallmentId: installment.id,
            });

            await this._investmentRepository.createInvestment(investment, session);

            const nextDate = calculateNextExecutionDate(
                sip.nextExecutionDate,
                sip.frequency
            );
            const updatedSip = SipEntity.executeInstallment(sip, nextDate);
            await this._sipRepository.update(updatedSip.id as string, updatedSip, session);

            await this._sipInstallmentRepository.markSuccess(
                installment.id as string,
                investment.id as string
            );

            await this._createNotificationUseCase.execute({
                userId: user.id as string,
                type: NotificationType.SIP,
                title: "SIP Installment Executed",
                message: `Your SIP installment of ₹${installment.amount} has been successfully invested in ${fund.schemeName} after successful retrial.`,
            });

            if (updatedSip.status === SipStatus.ACTIVE) {
                const nextInstallment = SipInstallmentEntity.create({
                    sipId: sip.id as string,
                    userId: sip.userId,
                    schemeCode: sip.schemeCode,
                    installmentNo: updatedSip.executedInstallments + 1,
                    executionDate: updatedSip.nextExecutionDate,
                    amount: sip.amount,
                });
                await this._sipInstallmentRepository.create(nextInstallment, session);
            }

            await this._transactionService.markSuccess(newTransaction, session);

            await session.commitTransaction();

        } catch (error) {
            await session.abortTransaction();
            console.error(`Retry transaction aborted for installment ${installment.id}:`, error);
            throw error;
        } finally {
            session.endSession();
        }
    }
}
