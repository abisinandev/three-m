import { inject, injectable } from "inversify";
import { IMutualFundsUseCase } from "./interfaces/mutual-fund-usecase.interface";
import { MutualFundDTO } from "@application/dto/mutual-funds/mutual-fund.dto";
import { ValidationError } from "@presentation/express/utils/error-handling";
import { ErrorMessage } from "@domain/enum/express/messages/error.message";
import { toEntity } from "@application/mappers/mutual-fund/mutual-fund.mapper";
import { IMutualFundRepository } from "@application/interfaces/repositories/feature/mutual-fund-repository.interface";
import { MUTUAL_FUND_TYPES } from "@infrastructure/inversify_di/features/mutual-fund/mutual-fund.types";

@injectable()
export class MutualFundsUseCase implements IMutualFundsUseCase {
    constructor(
        @inject(MUTUAL_FUND_TYPES.MutualFundRepository) private readonly _mutualFundRepository: IMutualFundRepository,
    ) { }

    async execute(dto: MutualFundDTO): Promise<void> {
        const isExist = await this._mutualFundRepository.findBySchemeCode(dto.schemeCode);
        if (isExist) throw new ValidationError(ErrorMessage.ALREADY_EXISTS);
        const entity = toEntity(dto);
        await this._mutualFundRepository.create(entity);
    }
}