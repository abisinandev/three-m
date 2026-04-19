import { InvestmentDTO } from "@application/dto/mutual-funds/investment-dto";
import { IOneTimeInvestmentUseCase } from "./interfaces/one-time-investment.usecase.interface";
import { USER_TYPES } from "@infrastructure/inversify_di/features/user/user.types";
import { IUserRepository } from "@application/interfaces/repositories/user/user-repository.interface";
import { inject, injectable } from "inversify";
import { NotFoundError, ValidationError } from "@presentation/express/utils/error-handling";
import { ErrorMessages } from "@shared/constants/error.messages";
import { IWalletRepository } from "@application/interfaces/repositories/user/wallet-repository.interface";
import { IInvestmentRepository } from "@application/interfaces/repositories/feature/investment-repository.interface";
import { InvestmentEntity } from "@domain/entities/mutual-fund/investment.entity";
import { ITransactionRepository } from "@application/interfaces/repositories/feature/transaction-repository.interface";
import { CurrencyTypes } from "@domain/enum/users/currency-enum";
import { TransactionStatus } from "@domain/enum/wallet/transaction-status.enum";
import { TransactionTypes } from "@domain/enum/wallet/transaction-types.enum";
import { IMutualFundRepository } from "@application/interfaces/repositories/feature/mutual-fund-repository.interface";
import { FundStatus } from "@domain/enum/funds/fund-status.enum";
import { TransactionReferenceType } from "@domain/enum/wallet/transaction-reference-type";
import { TransactionEntity } from "@domain/entities/transaction/transaction.entity";
import { MUTUAL_FUND_TYPES } from "@infrastructure/inversify_di/features/mutual-fund/mutual-fund.types";
import mongoose from "mongoose";


@injectable()
export class OneTimeInvestmentUseCase implements IOneTimeInvestmentUseCase {
    constructor(
        @inject(USER_TYPES.UserRepository) private readonly _userRepository: IUserRepository,
        @inject(USER_TYPES.WalletRepository) private readonly _walletRepository: IWalletRepository,
        @inject(MUTUAL_FUND_TYPES.InvestmentRepository) private readonly _investmentRepository: IInvestmentRepository,
        @inject(USER_TYPES.TransactionRepository) private readonly _transactionRepository: ITransactionRepository,
        @inject(MUTUAL_FUND_TYPES.MutualFundRepository) private readonly _mutualFundRepository: IMutualFundRepository,
    ) { }

    async execute(data: InvestmentDTO, userId: string): Promise<void> {
        const session = await mongoose.startSession();

        try {
            await session.withTransaction(async () => {
                const { amount, schemeCode, investmentType, paymentMethod } = data;

                const user = await this._userRepository.findById(userId, session);
                if (!user) throw new NotFoundError(ErrorMessages.AUTH.USER_NOT_FOUND);

                const wallet = await this._walletRepository.findOne({ userId });
                if (!wallet) throw new NotFoundError(ErrorMessages.PAYMENT.WALLET_NOT_FOUND);

                const fund = await this._mutualFundRepository.findBySchemeCode(data.schemeCode);
                if (!fund || fund.status === FundStatus.INACTIVE) throw new ValidationError(ErrorMessages.MUTUAL_FUND.FUND_INACTIVE);

                const transaction = TransactionEntity.create({
                    userId: user.id!,
                    userCode: user.userCode!,
                    amount,
                    currency: CurrencyTypes.INR,
                    status: TransactionStatus.PENDING,
                    type: TransactionTypes.INVESTMENT,
                    referenceType: TransactionReferenceType.SIP,
                    // referenceId: inv?.id as string,
                    // fundId: fund.id,//📌📌
                    // paymentStatus: TransactionStatus.SUCCESSFUL,
                })
                const newTransaction = await this._transactionRepository.createTransaction(transaction, session);

                if (wallet.availableBalance < amount)
                    throw new ValidationError(ErrorMessages.PAYMENT.INSUFFICIENT_BALANCE);

                wallet.lock(amount);
                wallet.debit(amount);
                wallet.unlock(amount);

                await this._walletRepository.update(wallet.id as string, wallet, session);

                const investment = InvestmentEntity.create({
                    userId,
                    schemeCode,
                    amount,
                    investmentType,
                    paymentMethod,
                });

                await this._investmentRepository.createInvestment(investment);

                newTransaction.markSucess();
                await this._transactionRepository.update(newTransaction.id as string, newTransaction, session);
                
            });

            await session.commitTransaction();

        } finally {
            await session.endSession();
        }
    }
}  