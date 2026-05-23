import { IInvestmentValidationService } from "./interfaces/investment-validation.service.interface";
import { UserEntity } from "@domain/entities/user/user.entity";
import { WalletEntity } from "@domain/entities/user/wallet.entity";
import { MutualFundEntity } from "@domain/entities/mutual-fund/mutual-fund-entity";
import { IUserRepository } from "@application/interfaces/repositories/user/user-repository.interface";
import { IWalletRepository } from "@application/interfaces/repositories/user/wallet-repository.interface";
import { IMutualFundRepository } from "@application/interfaces/repositories/feature/mutual-fund-repository.interface";
import { NotFoundError, ValidationError } from "@presentation/express/utils/error-handling";
import { ErrorMessages } from "@shared/constants/error.messages";
import { FundStatus } from "@domain/enum/funds/fund-status.enum";
import { ClientSession } from "mongoose";
import { inject, injectable } from "inversify";
import { USER_TYPES } from "@infrastructure/inversify_di/features/user/user.types";
import { MUTUAL_FUND_TYPES } from "@infrastructure/inversify_di/features/mutual-fund/mutual-fund.types";

@injectable()
export class InvestmentValidationService implements IInvestmentValidationService {
    constructor(
        @inject(USER_TYPES.UserRepository) private readonly _userRepository: IUserRepository,
        @inject(USER_TYPES.WalletRepository) private readonly _walletRepository: IWalletRepository,
        @inject(MUTUAL_FUND_TYPES.MutualFundRepository) private readonly _mutualFundRepository: IMutualFundRepository,
    ) { }

    async validateInvestment(
        userId: string,
        schemeCode: string,
        amount: number,
        session?: ClientSession
    ): Promise<{
        user: UserEntity;
        wallet: WalletEntity;
        fund: MutualFundEntity;
    }> {
        const user = await this._userRepository.findById(userId, session);
        if (!user) throw new NotFoundError(ErrorMessages.AUTH.USER_NOT_FOUND);

        if (!user.isVerified) throw new ValidationError(ErrorMessages.AUTH.COMPLETE_KYC);

        const wallet = await this._walletRepository.findByUserId(userId, session);
        if (!wallet) throw new NotFoundError(ErrorMessages.PAYMENT.WALLET_NOT_FOUND);

        const fund = await this._mutualFundRepository.findBySchemeCode(schemeCode, session);
        if (!fund || fund.status === FundStatus.INACTIVE) {
            throw new ValidationError(ErrorMessages.MUTUAL_FUND.FUND_INACTIVE);
        }

        if (wallet.availableBalance < amount) {
            throw new ValidationError(ErrorMessages.PAYMENT.INSUFFICIENT_BALANCE);
        }

        return { user, wallet, fund };
    }
}
