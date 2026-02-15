import { inject, injectable } from "inversify";
import { IConfirmRedeemUseCase } from "./interfaces/confirm-redeem-usecase.interface";
import { ConfirmRedeemDTO } from "@application/dto/portfolio/confirm-radeem-dto";
import { USER_TYPES } from "@infrastructure/inversify_di/features/user/user.types";
import { IUserRepository } from "@application/interfaces/repositories/user/user-repository.interface";
import { IInvestmentRepository } from "@application/interfaces/repositories/feature/investment-repository.interface";
import { ConflictError, NotFoundError } from "@presentation/express/utils/error-handling";
import { ErrorMessages } from "@shared/constants/error.messages";
import { IMutualFundRepository } from "@application/interfaces/repositories/feature/mutual-fund-repository.interface";
import { FundStatus } from "@domain/enum/funds/fund-status.enum";
import { IMutualFundNavUpdateProvider } from "@application/interfaces/services/externals/mutual-fund-nav-update-provider.interface";
import mongoose from "mongoose";
import { InvestmentEntity } from "@domain/entities/mutual-fund/investment.entity";
import { IWalletRepository } from "@application/interfaces/repositories/user/wallet-repository.interface";
import { MUTUAL_FUND_TYPES } from "@infrastructure/inversify_di/features/mutual-fund/mutual-fund.types";

@injectable()
export class ConfirmRedeemUseCase implements IConfirmRedeemUseCase {
    constructor(
        @inject(USER_TYPES.UserRepository) private readonly _userRepository: IUserRepository,
        @inject(MUTUAL_FUND_TYPES.InvestmentRepository) private readonly _investmentRepository: IInvestmentRepository,
        @inject(MUTUAL_FUND_TYPES.MutualFundRepository) private readonly _mutualfundRepository: IMutualFundRepository,
        @inject(MUTUAL_FUND_TYPES.NavUpdateProvider) private readonly _navProvider: IMutualFundNavUpdateProvider,
        @inject(USER_TYPES.WalletRepository) private readonly _walletRepository: IWalletRepository,
    ) { }

    async execute(data: ConfirmRedeemDTO): Promise<void> {
        const user = await this._userRepository.findById(data.userId);
        if (!user) throw new NotFoundError(ErrorMessages.AUTH.USER_NOT_FOUND);

        const fund = await this._mutualfundRepository.findBySchemeCode(data.schemeCode);
        if (!fund) throw new NotFoundError(ErrorMessages.DB.DATA_NOT_FOUND);
        switch (fund.status) {
            case FundStatus.INACTIVE:
                throw new ConflictError(ErrorMessages.MUTUAL_FUND.REDEMPTION_FAILED);

            case FundStatus.CLOSED:
                throw new ConflictError(ErrorMessages.MUTUAL_FUND.FUND_CLOSED);

            case FundStatus.SUSPENDED:
                throw new ConflictError(ErrorMessages.MUTUAL_FUND.FUND_SUSPENDED);

            default:
                break;
        };

        const groupedInvestment = await this._investmentRepository.findGroupedInvestmentsByUser(data.userId) ?? [];
        const investment = groupedInvestment.find(investment => investment.schemeCode === data.schemeCode);
        if (!investment || investment.totalUnits <= 0) {
            throw new ConflictError(ErrorMessages.MUTUAL_FUND.NO_REDEEMABLE_UNITS);
        }

        const navHistory = await this._navProvider.fetchNavHistories(data.schemeCode);
        const latestNav = navHistory?.[0]?.nav;

        if (!latestNav || latestNav <= 0) {
            throw new ConflictError(ErrorMessages.MUTUAL_FUND.NAV_NOT_AVAILABLE);
        }


        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            let unitsToRedeem: number;

            if (!data.amount && !data.units) {
                unitsToRedeem = investment.totalUnits;
            } else if (data.amount) {
                unitsToRedeem = Number((Number(data.amount) / latestNav).toFixed(4));
            } else {
                unitsToRedeem = Number(Number(data.units).toFixed(4));
            }

            if (unitsToRedeem <= 0 || unitsToRedeem > investment.totalUnits) {
                throw new ConflictError(ErrorMessages.MUTUAL_FUND.INVALID_REDEEM_REQUEST);
            }

            let remainingUnitsToRedeem = unitsToRedeem;

            const fifoInvestments = investment.investments.sort(
                (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
            );

            for (const inv of fifoInvestments) {
                if (remainingUnitsToRedeem <= 0) break;

                const redeemableUnits = Math.min(
                    inv.remainingUnits as number,
                    remainingUnitsToRedeem,
                );

                const updated = InvestmentEntity.redeemUnits(
                    inv.remainingUnits as number,
                    inv.redeemedUnits,
                    redeemableUnits,
                    Number((redeemableUnits * latestNav).toFixed(2)),
                );

                remainingUnitsToRedeem = Number((remainingUnitsToRedeem - redeemableUnits).toFixed(4));
                await this._investmentRepository.redeemInvestments(
                    inv.id as string,
                    data.userId,
                    updated,
                    session,
                );
            }

            if (remainingUnitsToRedeem !== 0) {
                throw new ConflictError(ErrorMessages.MUTUAL_FUND.REDEMPTION_FAILED);
            }
            const redeemAmount = Number((unitsToRedeem * latestNav).toFixed(2));
            await this._walletRepository.credit(
                data.userId,
                redeemAmount,
                session
            );

            await session.commitTransaction();
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }

    }
}; 