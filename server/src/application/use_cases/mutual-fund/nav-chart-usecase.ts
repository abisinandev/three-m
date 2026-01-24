import { inject, injectable } from "inversify";
import { INavHistoryUseCase } from "./interfaces/nav-history-usecase.interface";
import { FEATURE_TYPES } from "@infrastructure/inversify_di/types/feature/feature.type";
import { IMutualFundNavRepository } from "@application/interfaces/repositories/feature/mutual-fund-nav-repository.interface";
import { NotFoundError } from "@presentation/express/utils/error-handling";
import { ErrorMessage } from "@domain/enum/express/messages/error.message";

@injectable()
export class NavHistoryUseCase implements INavHistoryUseCase {
    constructor(
        @inject(FEATURE_TYPES.MutualFundNavRepository) private readonly _mfNavRepository: IMutualFundNavRepository,
    ) { }

    async execute(interval: string): Promise<void> {
        // const funds = await this._mfNavRepository.findByInterval(interval);
        // if (!funds) throw new NotFoundError(ErrorMessage.NOT_FOUND);

        // console.log('funds xx:', funds);
        return
    }
}