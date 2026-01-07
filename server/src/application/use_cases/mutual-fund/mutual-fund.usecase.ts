import { inject, injectable } from "inversify";
import { IMutualFundsUseCase } from "../interfaces/features/mutual-funds/mutual-fund-usecase.interface";
import { MutualFundDTO } from "@application/dto/mutual-funds/mutual-fund.dto";
import { FEATURE_TYPES } from "@infrastructure/inversify_di/types/feature/feature.type";
import { IMutualFundRepository } from "@application/interfaces/repositories/mutual-fund-repository.interface";
import { MutualFundEntity } from "@domain/entities/mutual-fund-entity";
import { FundStatus } from "@domain/enum/funds/fund-status.enum";
import { ValidationError } from "@presentation/express/utils/error-handling";
import { ErrorMessage } from "@domain/enum/express/messages/error.message";
import { toEntity } from "@application/mappers/mutual-fund/mutual-fund.mapper";

@injectable()
export class MutualFundsUseCase implements IMutualFundsUseCase {
    constructor(
        @inject(FEATURE_TYPES.MutualFundRepository) private readonly _mutualFundRepository: IMutualFundRepository,
    ) { }

    async execute(dto: MutualFundDTO): Promise<void> {

        const isExist = await this._mutualFundRepository.findBySchemeCode(dto.schemeCode);
        if (isExist) throw new ValidationError(ErrorMessage.ALREADY_EXISTS);

        const entity = toEntity(dto);
        await this._mutualFundRepository.create(entity);
    }
}