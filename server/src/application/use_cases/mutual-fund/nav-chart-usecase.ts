import { inject, injectable } from "inversify";
import { INavHistoryUseCase } from "./interfaces/nav-history-usecase.interface";
import { IMutualFundNavRepository } from "@application/interfaces/repositories/feature/mutual-fund-nav-repository.interface";
import { MUTUAL_FUND_TYPES } from "@infrastructure/inversify_di/features/mutual-fund/mutual-fund.types";

@injectable()
export class NavHistoryUseCase implements INavHistoryUseCase {
    constructor(
        @inject(MUTUAL_FUND_TYPES.MutualFundNavRepository) private readonly _mfNavRepository: IMutualFundNavRepository,
    ) { }

    async execute(_interval: string): Promise<void> {
        // const funds = await this._mfNavRepository.findByInterval(interval);
        // if (!funds) throw new NotFoundError(ErrorMessage.NOT_FOUND);

        // console.log('funds xx:', funds);
        return
    }
}