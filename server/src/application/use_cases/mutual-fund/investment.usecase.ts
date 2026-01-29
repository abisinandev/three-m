import { InvestmentDTO } from "@application/dto/mutual-funds/investment-dto";
import { IInvestmentUseCase } from "./interfaces/investment-usecase.interface";
import { USER_TYPES } from "@infrastructure/inversify_di/features/user/user.types";
import { IUserRepository } from "@application/interfaces/repositories/user/user-repository.interface";
import { inject, injectable } from "inversify";
import { NotFoundError, ValidationError } from "@presentation/express/utils/error-handling";
import { ErrorMessage } from "@domain/enum/express/messages/error.message";
import { IWalletRepository } from "@application/interfaces/repositories/user/wallet-repository.interface";
import { IInvestmentRepository } from "@application/interfaces/repositories/feature/investment-repository.interface";
import { IMutualFundNavRepository } from "@application/interfaces/repositories/feature/mutual-fund-nav-repository.interface";
import mongoose from "mongoose";
import { InvestmentEntity } from "@domain/entities/mutual-fund/investment.entity";
import { ITransactionRepository } from "@application/interfaces/repositories/feature/transaction-repository.interface";
import { toTransactionEntity } from "@application/mappers/user/transaction-mapper";
import { CurrencyTypes } from "@domain/enum/users/currency-enum";
import { TransactionStatus } from "@domain/enum/wallet/transaction-status.enum";
import { TransactionTypes } from "@domain/enum/wallet/transaction-types.enum";
import { IMutualFundRepository } from "@application/interfaces/repositories/feature/mutual-fund-repository.interface";
import { FundStatus } from "@domain/enum/funds/fund-status.enum";
import { TransactionReferenceType } from "@domain/enum/wallet/transaction-reference-type";
import { IInternalTransactionVerificationService } from "@application/interfaces/services/externals/internal-transaction-verify.interface";
import { TransactionEntity } from "@domain/entities/transaction/transaction.entity";
import { MUTUAL_FUND_TYPES } from "@infrastructure/inversify_di/features/mutual-fund/mutual-fund.types";
import { EXTERNAL_TYPES } from "@infrastructure/inversify_di/features/external/external.types";

@injectable()
export class InvestmentUseCase implements IInvestmentUseCase {
    constructor(
        @inject(USER_TYPES.UserRepository) private readonly _userRepository: IUserRepository,
        @inject(USER_TYPES.WalletRepository) private readonly _walletRepository: IWalletRepository,
        @inject(MUTUAL_FUND_TYPES.InvestmentRepository) private readonly _investmentRepository: IInvestmentRepository,
        @inject(MUTUAL_FUND_TYPES.MutualFundNavRepository) private readonly _navRepository: IMutualFundNavRepository,
        @inject(USER_TYPES.TransactionRepository) private readonly _transactionRepository: ITransactionRepository,
        @inject(MUTUAL_FUND_TYPES.MutualFundRepository) private readonly _mutualFundRepository: IMutualFundRepository,
        @inject(EXTERNAL_TYPES.InternalTransactionVerificationService) private readonly _internalTransactionVerify: IInternalTransactionVerificationService,

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

                await this._walletRepository.debit(userId, amount, session);

                const investment = InvestmentEntity.create({
                    userId,
                    schemeCode,
                    amount,
                    investmentType,
                    paymentMethod,
                });
                const inv = await this._investmentRepository.createInvestment(investment);
                console.log("INvestmetn: ", inv);
                const transaction = TransactionEntity.create({
                    userId: user.id!,
                    userCode: user.userCode!,
                    amount,
                    currency: CurrencyTypes.INR,
                    status: TransactionStatus.SUCCESSFUL,
                    type: TransactionTypes.INVESTMENT,
                    referenceType: TransactionReferenceType.SIP,
                    referenceId: inv?.id as string,
                    fundId: fund.id,
                    paymentStatus: TransactionStatus.SUCCESSFUL,
                    isVerified: true,
                })
                const txns = await this._transactionRepository.createTransaction(transaction, session);
                // await this._internalTransactionVerify.verify(txns?.id as string);
            });

            await session.commitTransaction();
        } finally {
            await session.endSession();
        }
    }
}  