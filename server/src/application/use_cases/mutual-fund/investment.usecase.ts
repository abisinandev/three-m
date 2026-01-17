import { InvestmentDTO } from "@application/dto/mutual-funds/investment-dto";
import { IInvestmentUseCase } from "../interfaces/features/mutual-funds/investment-usecase.interface";
import { USER_TYPES } from "@infrastructure/inversify_di/types/user/user.types";
import { IUserRepository } from "@application/interfaces/repositories/user/user-repository.interface";
import { inject } from "inversify";
import { NotFoundError, ValidationError } from "@presentation/express/utils/error-handling";
import { ErrorMessage } from "@domain/enum/express/messages/error.message";
import { IWalletRepository } from "@application/interfaces/repositories/user/wallet-repository.interface";
import { FEATURE_TYPES } from "@infrastructure/inversify_di/types/feature/feature.type";
import { IInvestmentRepository } from "@application/interfaces/repositories/feature/investment-repository.interface";
import { IMutualFundNavRepository } from "@application/interfaces/repositories/feature/mutual-fund-nav-repository.interface";
import mongoose from "mongoose";
import { InvestmentEntity } from "@domain/entities/mutual-fund/investment.entity";
import { ITransactionRepository } from "@application/interfaces/repositories/feature/transaction-repository.interface";
import { toTransactionEntity } from "@application/mappers/user/transaction-mapper";
import { CurrencyTypes } from "@domain/enum/users/currency-enum";
import { TransactionStatus } from "@domain/enum/wallet/transaction-status.enum";
import { ReferenceType } from "@domain/enum/wallet/transaction-reference.enum";
import { TransactionTypes } from "@domain/enum/wallet/transaction-types.enum";
import { IMutualFundRepository } from "@application/interfaces/repositories/feature/mutual-fund-repository.interface";
import { FundStatus } from "@domain/enum/funds/fund-status.enum";

export class InvestmentUseCase implements IInvestmentUseCase {
    constructor(
        @inject(USER_TYPES.UserRepository) private readonly _userRepository: IUserRepository,
        @inject(USER_TYPES.WalletRepository) private readonly _walletRepository: IWalletRepository,
        @inject(FEATURE_TYPES.InvestmentRepository) private readonly _investmentRepository: IInvestmentRepository,
        @inject(FEATURE_TYPES.MutualFundNavRepository) private readonly _navRepository: IMutualFundNavRepository,
        @inject(USER_TYPES.TransactionRepository) private readonly _transactionRepository: ITransactionRepository,
        @inject(FEATURE_TYPES.MutualFundRepository) private readonly _mutualFundRepository: IMutualFundRepository,
    ) { }

    async execute(data: InvestmentDTO, userId: string): Promise<void> {
        const session = await mongoose.startSession();

        try {
            await session.withTransaction(async () => {
                const { amount, schemeCode, investmentType, paymentMethod } = data;

                const user = await this._userRepository.findById(userId, session);
                if (!user) throw new NotFoundError(ErrorMessage.USER_NOT_FOUND);


                const wallet = await this._walletRepository.findOne({ userId });
                if (!wallet) throw new NotFoundError(ErrorMessage.WALLET_NOT_FOUND);

                const fund = await this._mutualFundRepository.findBySchemeCode(data.schemeCode);
                if (!fund || fund.status === FundStatus.INACTIVE) throw new ValidationError(ErrorMessage.FUND_INACTIVE);

                if (wallet.balance < amount) {
                    throw new ValidationError(ErrorMessage.INSUFFICIENT_BALANCE);
                }

                const latestNav = await this._navRepository.findBySchemeCode(schemeCode, session);
                if (!latestNav) throw new ValidationError("NAV not available");

                await this._walletRepository.debit(userId, amount, session);

                const investment = InvestmentEntity.create({
                    userId,
                    schemeCode,
                    amount,
                    investmentType,
                    paymentMethod,
                });
                await this._investmentRepository.create(investment, session);
                const transaction = toTransactionEntity({
                    userId,
                    userCode: user.userCode,
                    amount,
                    currency: CurrencyTypes.INR,
                    paymentStatus: TransactionStatus.PENDING,
                    referenceType: ReferenceType.WALLET,
                    status: TransactionStatus.PROCESSING,
                    type: TransactionTypes.INVEST,
                    fundId: fund.id,
                });

                await this._transactionRepository.create(transaction, session);
            });

            await session.commitTransaction();
        } finally {
            await session.endSession();
        }
    }
} 