import { inject, injectable } from "inversify";
import { USER_TYPES } from "@infrastructure/inversify_di/features/user/user.types";
import { IUserRepository } from "@application/interfaces/repositories/user/user-repository.interface";
import { ISipRepository } from "@application/interfaces/repositories/feature/sip-repository.interface";
import { NotFoundError, UnauthorizedError, ValidationError } from "@presentation/express/utils/error-handling";
import { ErrorMessages } from "@shared/constants/error.messages";
import { ICancelSipUseCase } from "./interfaces/cancel-sip-usecase.interface";
import { SIP_TYPES } from "@infrastructure/inversify_di/features/sip/sip.types";
import { SipStatus } from "@domain/enum/funds/sip.enums";
import mongoose from "mongoose";
import { ISipInstallmentRepository } from "@application/interfaces/repositories/feature/sip-intallment-repository.interface";
import { SipInstallmentStatus } from "@domain/enum/funds/sip-intallment-status";
import { SipInstallmentEntity } from "@domain/entities/mutual-fund/sip-intallment.entity";
import { MUTUAL_FUND_TYPES } from "@infrastructure/inversify_di/features/mutual-fund/mutual-fund.types";
import { IInvestmentRepository } from "@application/interfaces/repositories/feature/investment-repository.interface";
import { InvestmentStatus } from "@domain/enum/funds/investment.enums";

@injectable()
export class CancelSipUseCase implements ICancelSipUseCase {

    constructor(
        @inject(USER_TYPES.UserRepository) private readonly _userRepository: IUserRepository,
        @inject(SIP_TYPES.SipRepository) private readonly _sipRepository: ISipRepository,
        @inject(SIP_TYPES.SipInstallmentRepository) private readonly _installmentsRepository: ISipInstallmentRepository,
        @inject(MUTUAL_FUND_TYPES.InvestmentRepository) private readonly _investmentRepository: IInvestmentRepository,
    ) { }

    async execute(userId: string, sipId: string): Promise<void> {
        const session = await mongoose.startSession();

        try {
            await session.startTransaction();

            const user = await this._userRepository.findById(userId);
            if (!user) throw new NotFoundError(ErrorMessages.AUTH.USER_NOT_FOUND);

            const sip = await this._sipRepository.findById(sipId);
            if (!sip) throw new NotFoundError(`${ErrorMessages.DB.DATA_NOT_FOUND} SIP`);

            if (sip.userId !== userId) throw new UnauthorizedError(`${ErrorMessages.AUTH.UNAUTHORIZED} SIP`);

            if (sip.status === SipStatus.CANCELLED)
                throw new ValidationError(ErrorMessages.SIP.ALREADY_CANCELLED);

            const installments = await this._installmentsRepository.findActiveAndPendingInstallments(
                userId,
                sipId,
                session
            );

            const hasUnredeemedInvestments = (
                await Promise.all(
                    installments.map(async (i) => {
                        if (i.status !== SipInstallmentStatus.SUCCESS) {
                            return false;
                        }
                        const investment =
                            await this._investmentRepository.findInvestmentsByInstallments(
                                userId,
                                i.id as string
                            );

                        return investment && investment.status !== InvestmentStatus.REDEEMED;
                    })
                )
            ).some(Boolean);
            
            if (hasUnredeemedInvestments) {
                throw new ValidationError(ErrorMessages.SIP.EXISTING_INSTALLMENTS);
            }

            for (const installment of installments) {
                if (installment.status === SipInstallmentStatus.PENDING) {
                    const cancelledInstallment = SipInstallmentEntity.cancel(installment);
                    await this._installmentsRepository.update(cancelledInstallment.id as string, cancelledInstallment, session);
                }
            }

            sip.cancel();
            await this._sipRepository.update(sipId, sip, session);

            await session.commitTransaction();
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    }
}