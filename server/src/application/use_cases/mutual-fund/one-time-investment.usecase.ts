import { InvestmentDTO } from "@application/dto/mutual-funds/investment-dto";
import { IOneTimeInvestmentUseCase } from "./interfaces/one-time-investment.usecase.interface";
import { inject, injectable } from "inversify";
import { IInvestmentRepository } from "@application/interfaces/repositories/feature/investment-repository.interface";
import { InvestmentEntity } from "@domain/entities/mutual-fund/investment.entity";
import { MUTUAL_FUND_TYPES } from "@infrastructure/inversify_di/features/mutual-fund/mutual-fund.types";
import mongoose from "mongoose";
import { EXTERNAL_TYPES } from "@infrastructure/inversify_di/features/external/external.types";
import { IIdempotencyService } from "@application/services/idempotency/interface/idempotency-service.interface";
import { IInvestmentValidationService } from "@application/services/mutual-fund/interfaces/investment-validation.service.interface";
import { ITransactionService } from "@application/services/transaction/interfaces/transaction.service.interface";
import { IWalletService } from "@application/services/wallet/interfaces/wallet.service.interface";
import { USER_TYPES } from "@infrastructure/inversify_di/features/user/user.types";

@injectable()
export class OneTimeInvestmentUseCase implements IOneTimeInvestmentUseCase {
    constructor(
        @inject(MUTUAL_FUND_TYPES.InvestmentRepository) private readonly _investmentRepository: IInvestmentRepository,
        @inject(EXTERNAL_TYPES.IdempotencyService) private readonly _idempotencyService: IIdempotencyService,
        @inject(MUTUAL_FUND_TYPES.InvestmentValidationService) private readonly _validationService: IInvestmentValidationService,
        @inject(USER_TYPES.TransactionService) private readonly _transactionService: ITransactionService,
        @inject(USER_TYPES.WalletService) private readonly _walletService: IWalletService,
    ) { }

    async execute(data: InvestmentDTO, userId: string, idempotencyKey: string): Promise<void> {
        const { amount, schemeCode, investmentType, paymentMethod } = data;
        
        await this._idempotencyService.checkAndLock(idempotencyKey, data);

        const session = await mongoose.startSession();

        try {
            await session.withTransaction(async () => {
                const { user, wallet, fund } = await this._validationService.validateInvestment(
                    userId,
                    schemeCode,
                    amount,
                    session
                );

                const newTransaction = await this._transactionService.createInvestmentTransaction(
                    user,
                    amount,
                    fund.id as string,
                    session
                );

                await this._walletService.debit(wallet, amount, session);

                const investment = InvestmentEntity.create({
                    userId,
                    schemeCode,
                    amount,
                    investmentType,
                    paymentMethod,
                });
                await this._investmentRepository.createInvestment(investment, session);

                await this._transactionService.markSuccess(newTransaction, session);
            });

        } finally {
            await session.endSession();
        }
    }
}
