import { inject, injectable } from "inversify";
import { IChangeFundStatusUseCase } from "./interfaces/change-fund-status-usecase.interface";
import { NotFoundError } from "@presentation/express/utils/error-handling";
import { ErrorMessages } from "@shared/constants/error.messages";
import { FundStatus } from "@domain/enum/funds/fund-status.enum";
import { IMutualFundRepository } from "@application/interfaces/repositories/feature/mutual-fund-repository.interface";
import { MUTUAL_FUND_TYPES } from "@infrastructure/inversify_di/features/mutual-fund/mutual-fund.types";

@injectable()
export class ChangeStatusUseCase implements IChangeFundStatusUseCase {
    constructor(
        @inject(MUTUAL_FUND_TYPES.MutualFundRepository) private readonly _mutualFundRepository: IMutualFundRepository,
    ) { }

    async execute(fundId: string): Promise<void> {
        const fund = await this._mutualFundRepository.findById(fundId);
        if (!fund) throw new NotFoundError(ErrorMessages.DB.DATA_NOT_FOUND);

        await this._mutualFundRepository.update(fundId, {
            status: fund.status === "Active" ? FundStatus.INACTIVE : FundStatus.ACTIVE
        });

    }
}