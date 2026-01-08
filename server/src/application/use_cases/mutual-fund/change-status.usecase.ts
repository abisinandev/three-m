import { inject, injectable } from "inversify";
import { IChangeFundStatusUseCase } from "../interfaces/features/mutual-funds/change-fund-status-usecase.interface";
import { FEATURE_TYPES } from "@infrastructure/inversify_di/types/feature/feature.type";
import { NotFoundError } from "@presentation/express/utils/error-handling";
import { ErrorMessage } from "@domain/enum/express/messages/error.message";
import { FundStatus } from "@domain/enum/funds/fund-status.enum";
import { IMutualFundRepository } from "@application/interfaces/repositories/feature/mutual-fund-repository.interface";

@injectable()
export class ChangeStatusUseCase implements IChangeFundStatusUseCase {
    constructor(
        @inject(FEATURE_TYPES.MutualFundRepository) private readonly _mutualFundRepository: IMutualFundRepository,
    ) { }

    async execute(fundId: string): Promise<void> {
        const fund = await this._mutualFundRepository.findById(fundId);
        if (!fund) throw new NotFoundError(ErrorMessage.NOT_FOUND);
    
        await this._mutualFundRepository.update(fundId, {
            status: fund.status === "Active" ? FundStatus.INACTIVE : FundStatus.ACTIVE
        });

    }
}