import { ISipManagementUseCase } from "@application/use_cases/admin/sip-management/interfaces/sip-management-usecase.interface";
import { ISipRepository } from "@application/interfaces/repositories/feature/sip-repository.interface";
import { QueryOptions } from "mongoose";
import { inject, injectable } from "inversify";
import { SipDto } from "@application/dto/sip/sip-response.dto";
import { SIP_TYPES } from "@infrastructure/inversify_di/features/sip/sip.types";
import { USER_TYPES } from "@infrastructure/inversify_di/features/user/user.types";
import { IUserRepository } from "@application/interfaces/repositories/user/user-repository.interface";

@injectable()
export class SipManagementUseCase implements ISipManagementUseCase {
    constructor(
        @inject(SIP_TYPES.SipRepository) private _sipRepository: ISipRepository,
        @inject(USER_TYPES.UserRepository) private _userRepo: IUserRepository,
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

        const sipDtos: SipDto[] = await Promise.all(
            data.map(async (sip) => {
                const user = await this._userRepo.findById(sip.userId);

                return {
                    id: sip.id,
                    userId: sip.userId,
                    userCode: user?.userCode,
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
                };
            })
        );

        return {
            page,
            limit,
            totalCount,
            data: sipDtos,
            totalActiveSips,
        };
    }


}