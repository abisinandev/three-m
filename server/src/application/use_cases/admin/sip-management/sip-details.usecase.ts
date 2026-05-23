import { inject, injectable } from "inversify";
import { ISipInstallmentRepository } from "@application/interfaces/repositories/feature/sip-intallment-repository.interface";
import { ISipRepository } from "@application/interfaces/repositories/feature/sip-repository.interface";
import { SipInstallmentDto } from "@application/dto/sip/sip-installment.dto";
import { NotFoundError } from "@presentation/express/utils/error-handling";
import { QueryOptions } from "mongoose";
import { SipDto } from "@application/dto/sip/sip-response.dto";
import { USER_TYPES } from "@infrastructure/inversify_di/features/user/user.types";
import { IUserRepository } from "@application/interfaces/repositories/user/user-repository.interface";
import { ISipDetailsUseCase } from "./interfaces/sip-details-usecase.interface";
import { SIP_TYPES } from "@infrastructure/inversify_di/features/sip/sip.types";

@injectable()
export class SipDetailsUseCase implements ISipDetailsUseCase {

    constructor(
        @inject(SIP_TYPES.SipInstallmentRepository) private readonly _sipInstallmentRepository: ISipInstallmentRepository,
        @inject(SIP_TYPES.SipRepository) private readonly _sipRepository: ISipRepository,
        @inject(USER_TYPES.UserRepository) private readonly _userRepository: IUserRepository,
    ) { }

    async execute(sipId: string, options?: QueryOptions): Promise<{
        data: SipDto;
        page: number;
        limit: number;
        totalCount: number;
    }> {
        const sip = await this._sipRepository.findById(sipId);
        if (!sip) throw new NotFoundError("SIP not found");

        const actualUserId = sip.userId.toString();

        const limit = Number(options?.limit) || 10;
        const page = Number(options?.page) || 1;
        const skip = (page - 1) * limit;

        const queryOptions = {
            sipId,
            limit,
            skip,
            status: options?.status,
        };

        const [installments, totalCount] = await Promise.all([
            this._sipInstallmentRepository.findInstallmentsBySip(
                actualUserId,
                sip.id as string
            ),
            this._sipInstallmentRepository.countInstallments(
                actualUserId,
                queryOptions
            )
        ]);

        const user = await this._userRepository.findById(sip.userId as string);
        const installmentDtos: SipInstallmentDto[] =
            (installments ?? []).map(i => ({
                id: i.id,
                sipId: i.sipId,
                userId: i.userId,
                schemeCode: i.schemeCode,
                installmentNo: i.installmentNo,
                executionDate: i.executionDate,
                amount: i.amount,
                nav: i.nav ?? undefined,
                units: i.units ?? undefined,
                status: i.status,
                failureReason: i.failureReason ?? undefined,
                investmentId: i.investmentId ?? undefined,
                createdAt: i.createdAt,
            }));

        return {
            data: {
                id: sip.id,
                userId: sip.userId,
                userCode: user?.userCode,
                schemeCode: sip.schemeCode,
                amount: sip.amount,
                frequency: sip.frequency,
                status: sip.status,
                startDate: sip.startDate,
                nextExecutionDate: sip.nextExecutionDate,
                executedInstallments: sip.executedInstallments,
                totalInstallments: sip.totalInstallments,
                createdAt: sip.createdAt,
                updatedAt: sip.updatedAt,
                installments: installmentDtos.map(insta => insta),
            },
            page,
            limit,
            totalCount,
        }
    }
}
