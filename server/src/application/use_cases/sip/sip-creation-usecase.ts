import { inject, injectable } from "inversify";
import { ISipCreationUseCase } from "./interfaces/sip-creation-usecase.interface";
import { SipCreationDTO } from "@application/dto/sip/sip-creation.dto";
import mongoose from "mongoose";
import { ISipRepository } from "@application/interfaces/repositories/feature/sip-repository.interface";
import { SipEntity } from "@domain/entities/mutual-fund/sip.entity";
import { ISipInstallmentRepository } from "@application/interfaces/repositories/feature/sip-intallment-repository.interface";
import { SipInstallmentEntity } from "@domain/entities/mutual-fund/sip-intallment.entity";
import AppError from "@presentation/express/utils/error-handling/app.error";
import { MUTUAL_FUND_TYPES } from "@infrastructure/inversify_di/features/mutual-fund/mutual-fund.types";
import { SIP_TYPES } from "@infrastructure/inversify_di/features/sip/sip.types";
import { SUBSCRIPTION_TYPES } from "@infrastructure/inversify_di/features/subscription/subscription.types";
import { IFeatureAccessService } from "@application/interfaces/services/subscription/feature-access-service.interface";
import { Features } from "@domain/entities/subscription/enums/features.enum";
import { SuccessMessages } from "@shared/constants/success.messages";
import { IIdempotencyService } from "@application/services/idempotency/interface/idempotency-service.interface";
import { EXTERNAL_TYPES } from "@infrastructure/inversify_di/features/external/external.types";
import { IInvestmentValidationService } from "@application/services/mutual-fund/interfaces/investment-validation.service.interface";

@injectable()
export class SipCreationUseCase implements ISipCreationUseCase {

    constructor(
        @inject(SIP_TYPES.SipRepository) private readonly _sipRepository: ISipRepository,
        @inject(SIP_TYPES.SipInstallmentRepository) private readonly _sipInstallmentRepository: ISipInstallmentRepository,
        @inject(SUBSCRIPTION_TYPES.FeatureAccessService) private readonly _featureAccess: IFeatureAccessService,
        @inject(EXTERNAL_TYPES.IdempotencyService) private readonly _idempotencyService: IIdempotencyService,
        @inject(MUTUAL_FUND_TYPES.InvestmentValidationService) private readonly _validationService: IInvestmentValidationService,
    ) { }

    async execute(data: SipCreationDTO, userId: string, idempotencyKey: string): Promise<void | { message: string, upgrade: boolean }> {

        const hasAccess = await this._featureAccess.hasAccess(
            userId,
            Features.SIP_AUTOMATION
        );

        if (!hasAccess) {
            return {
                message: SuccessMessages.SIP.UPGRADE_PREMIUM,
                upgrade: true
            };
        }

        await this._idempotencyService.checkAndLock(idempotencyKey, data);

        const session = await mongoose.startSession();

        try {
            await session.withTransaction(async () => {
                const { amount, frequency, schemeCode, startDate, totalInstallments } = data;

                await this._validationService.validateInvestment(
                    userId,
                    schemeCode,
                    amount,
                    session
                );

                const sipEntity = SipEntity.create({
                    userId,
                    schemeCode,
                    amount,
                    frequency,
                    startDate: new Date(startDate),
                    totalInstallments,
                });

                const createdSip = await this._sipRepository.createSip(sipEntity, session);
                if (!createdSip) throw new AppError("Sip creation failed");

                const installment = SipInstallmentEntity.create({
                    sipId: createdSip.id as string,
                    userId: createdSip.userId,
                    schemeCode: createdSip.schemeCode,
                    installmentNo: 1,
                    executionDate: createdSip.nextExecutionDate,
                    amount: createdSip.amount,
                });

                await this._sipInstallmentRepository.create(installment, session);
            });
        } finally {
            await session.endSession();
        }
    }
}
