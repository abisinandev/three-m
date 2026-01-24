import { inject, injectable } from "inversify";
import { IUserSipDetailsUseCase } from "./interfaces/user-sip-details-usecase.interface";
import { QueryOptions } from "mongoose";
import { FEATURE_TYPES } from "@infrastructure/inversify_di/types/feature/feature.type";
import { ISipRepository } from "@application/interfaces/repositories/feature/sip-repository.interface";
import { SipDto } from "@application/dto/sip/sip-response.dto";
import { ISipInstallmentRepository } from "@application/interfaces/repositories/feature/sip-intallment-repository.interface";
import { SipInstallmentDto } from "@application/dto/sip/sip-installment.dto";
import { toSipInstallmentResponse } from "@application/mappers/sips/sip-installment.mapper";

@injectable()
export class UserSipDetailsUseCase implements IUserSipDetailsUseCase {
    constructor(
        @inject(FEATURE_TYPES.SipRepository) private readonly _sipRepository: ISipRepository,
        @inject(FEATURE_TYPES.SipInstallmentRepository) private readonly _sipInstallmentRepository: ISipInstallmentRepository,
    ) { }

    async execute(data: QueryOptions, userId: string): Promise<{
        data: SipDto[];
        page: number;
        limit: number;
        totalCount: number;
    }> {
        const sips = (await this._sipRepository.findSipsByUser(data, userId)) ?? [];

        const grouped: SipDto[] = await Promise.all(
            sips.map(async (sip) => {
                const installmentEntities =
                    (await this._sipInstallmentRepository.findInstallmentsBySip(
                        sip.userId,
                        sip.id as string
                    )) ?? [];

                const installments: SipInstallmentDto[] = installmentEntities.map(
                    toSipInstallmentResponse
                );

                return {
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

                    installments,
                };
            })
        );

        return {
            data: grouped,
            page: data.page ?? 1,
            limit: data.limit ?? 10,
            totalCount: sips.length,
        };
    }
} 