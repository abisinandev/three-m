import { ISipManagementUseCase } from "@application/use_cases/interfaces/features/sip/sip-management-usecase.interface";
import { ISipRepository } from "@application/interfaces/repositories/feature/sip-repository.interface";
import { QueryOptions } from "mongoose";
import { inject, injectable } from "inversify";
import { FEATURE_TYPES } from "@infrastructure/inversify_di/types/feature/feature.type";
import { SipDto } from "@application/dto/sip/sip-response.dto";

@injectable()
export class SipManagementUseCase implements ISipManagementUseCase {
    constructor(
        @inject(FEATURE_TYPES.SipRepository) private _sipRepository: ISipRepository
    ) { }

    async execute(query: QueryOptions): Promise<{
        data: SipDto[];
        page: number;
        limit: number;
        totalCount: number;
        totalActiveSips: number;
    }> {
        const { page = 1, limit = 10 } = query;

        const data = await this._sipRepository.fetchAllSips(query);
        const { totalCount } = await this._sipRepository.count();
        const { totalActiveSips } = await this._sipRepository.findActiveSips();

        const sipDtos: SipDto[] = data.map((sip) => ({
            id: sip.id,
            userId: sip.userId,
            schemeCode: sip.schemeCode,
            amount: sip.amount,
            frequency: sip.frequency,
            startDate: sip.startDate,
            nextExecutionDate: sip.nextExecutionDate,
            totalInstallments: sip.totalInstallments,
            executedInstallments: sip.executedInstallments,
            status: sip.status,
            createdAt: sip.createdAt,
            updatedAt: sip.updatedAt,
        }));

        return {
            page,
            limit,
            totalCount,
            data: sipDtos,
            totalActiveSips,
        };
    }


}