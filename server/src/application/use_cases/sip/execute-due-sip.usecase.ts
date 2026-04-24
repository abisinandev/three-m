import { inject, injectable } from "inversify";
import { IExecuteDueSipsUseCase } from "./interfaces/execute-due-sip-usecase.interface";
import { ISipInstallmentRepository } from "@application/interfaces/repositories/feature/sip-intallment-repository.interface";
import { USER_TYPES } from "@infrastructure/inversify_di/features/user/user.types";
import { SipInstallmentEntity } from "@domain/entities/mutual-fund/sip-intallment.entity";
import { ISipRepository } from "@application/interfaces/repositories/feature/sip-repository.interface";
import { SipStatus } from "@domain/enum/funds/sip.enums";
import { IInvestmentRepository } from "@application/interfaces/repositories/feature/investment-repository.interface";
import { InvestmentEntity } from "@domain/entities/mutual-fund/investment.entity";
import { InvestmentType, PaymentMethod } from "@domain/enum/funds/investment.enums";
import { calculateNextExecutionDate } from "@shared/utils/sip/sip-installment.utils";
import { SipEntity } from "@domain/entities/mutual-fund/sip.entity";
import { ITransactionRepository } from "@application/interfaces/repositories/feature/transaction-repository.interface";
import { TransactionEntity } from "@domain/entities/transaction/transaction.entity";
import { CurrencyTypes } from "@domain/enum/users/currency-enum";
import { IUserRepository } from "@application/interfaces/repositories/user/user-repository.interface";
import { TransactionStatus } from "@domain/enum/wallet/transaction-status.enum";
import { TransactionReferenceType } from "@domain/enum/wallet/transaction-reference-type";
import { TransactionTypes } from "@domain/enum/wallet/transaction-types.enum";
import { IMutualFundRepository } from "@application/interfaces/repositories/feature/mutual-fund-repository.interface";
import mongoose from "mongoose";
import { SIP_TYPES } from "@infrastructure/inversify_di/features/sip/sip.types";
import { MUTUAL_FUND_TYPES } from "@infrastructure/inversify_di/features/mutual-fund/mutual-fund.types";
import { NOTIFICATION_TYEPS } from "@infrastructure/inversify_di/features/notification/notification.type";
import { ICreateNotificationUseCase } from "../notification/interfaces/create-notification-usecase.interface";
import { NotificationType } from "@domain/entities/notification/enums/notification-type.enums";
import { IWalletRepository } from "@application/interfaces/repositories/user/wallet-repository.interface";

@injectable()
export class ExecuteDueSipUseCase implements IExecuteDueSipsUseCase {
    constructor(
        @inject(SIP_TYPES.SipInstallmentRepository) private readonly _sipInstallmentRepository: ISipInstallmentRepository,
        @inject(SIP_TYPES.SipRepository) private readonly _sipRepository: ISipRepository,
        @inject(MUTUAL_FUND_TYPES.InvestmentRepository) private readonly _investmentRepository: IInvestmentRepository,
        @inject(USER_TYPES.TransactionRepository) private readonly _transactionRepository: ITransactionRepository,
        @inject(MUTUAL_FUND_TYPES.MutualFundRepository) private readonly _mutualfundRepo: IMutualFundRepository,
        @inject(USER_TYPES.UserRepository) private readonly _userRepository: IUserRepository,
        @inject(NOTIFICATION_TYEPS.CreateNotificationUseCase) private readonly _createNotificationUseCase: ICreateNotificationUseCase,
        @inject(USER_TYPES.WalletRepository) private readonly _walletRepository: IWalletRepository,
    ) { }

    async execute(): Promise<void> {
        const dueInstallments = await this._sipInstallmentRepository.findActiveDueSips() ?? [];
        for (let installment of dueInstallments) {
            await this.executeSingleInstallment(installment);
        }
    }

    private async executeSingleInstallment(installment: SipInstallmentEntity): Promise<void> {
        const session = await mongoose.startSession();
        try {
            session.startTransaction();

            const sip = await this._sipRepository.findById(installment.sipId);
            if (!sip || sip.status !== SipStatus.ACTIVE) return;

            const user = await this._userRepository.findById(installment.userId);
            if (!user) return

            const fund = await this._mutualfundRepo.findBySchemeCode(installment.schemeCode);
            if (!fund) return;

            const wallet = await this._walletRepository.findById(user.walletId as string);

            if ((wallet?.balance ?? 0) < installment.amount) {
                await this._sipInstallmentRepository.markFailed(
                    installment.id!,
                    "INSUFFICIENT_BALANCE"
                );

                await this._createNotificationUseCase.execute({
                    userId: user.id!,
                    type: NotificationType.SIP,
                    title: "SIP Installment Failed",
                    message: `Your SIP installment of ₹${installment.amount} failed due to insufficient wallet balance.`,
                });

                return; 
            }

            const transaction = TransactionEntity.create({
                userId: user.id!,
                userCode: user.userCode!,
                amount: installment.amount,
                currency: CurrencyTypes.INR,
                status: TransactionStatus.PENDING,
                type: TransactionTypes.SIP_INSTALLMENT,
                referenceType: TransactionReferenceType.SIP,
                referenceId: installment.id,
                fundId: fund.id,
            });
            await this._transactionRepository.create(transaction, session);

            const investment = InvestmentEntity.create({
                amount: installment.amount,
                investmentType: InvestmentType.SIP,
                paymentMethod: PaymentMethod.WALLET,
                schemeCode: installment.schemeCode,
                userId: installment.userId,
                sipInstallmentId: installment.id,
            });

            await this._investmentRepository.create(investment,session);

            const nextDate = calculateNextExecutionDate(
                sip.nextExecutionDate,
                sip.frequency
            );
            const updatedSip = SipEntity.executeInstallment(sip, nextDate);
            await this._sipRepository.update(updatedSip.id as string, updatedSip);

            await this._sipInstallmentRepository.markSuccess(
                installment.id as string,
                investment.id as string
            );

            //Notification
            await this._createNotificationUseCase.execute({
                userId: user.id!,
                type: NotificationType.SIP,
                title: "SIP Installment Executed",
                message: `Your SIP installment of ₹${installment.amount} has been successfully invested.`,
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

        } catch (error) {
            await session.abortTransaction();
            await this._sipInstallmentRepository.markFailed(
                installment.id!,
                error instanceof Error ? error.message : "EXECUTION_FAILED"
            );

        } finally {

            session.endSession();
        }

    }
} 
