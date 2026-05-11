import { UserEntity } from "@domain/entities/user/user.entity";
import { WalletEntity } from "@domain/entities/user/wallet.entity";
import { MutualFundEntity } from "@domain/entities/mutual-fund/mutual-fund-entity";
import { ClientSession } from "mongoose";

export interface IInvestmentValidationService {
    validateInvestment(
        userId: string,
        schemeCode: string,
        amount: number,
        session?: ClientSession
    ): Promise<{
        user: UserEntity;
        wallet: WalletEntity;
        fund: MutualFundEntity;
    }>;
}
