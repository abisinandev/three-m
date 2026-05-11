import { inject, injectable } from "inversify";
import { ISipCreationUseCase } from "./interfaces/sip-creation-usecase.interface";
import { SipCreationDTO } from "@application/dto/sip/sip-creation.dto";
import mongoose from "mongoose";
import { USER_TYPES } from "@infrastructure/inversify_di/features/user/user.types";
import { IUserRepository } from "@application/interfaces/repositories/user/user-repository.interface";
import { IWalletRepository } from "@application/interfaces/repositories/user/wallet-repository.interface";
import { IMutualFundRepository } from "@application/interfaces/repositories/feature/mutual-fund-repository.interface";
import { ErrorMessages } from "@shared/constants/error.messages";
import { NotFoundError, ValidationError } from "@presentation/express/utils/error-handling";
import { FundStatus } from "@domain/enum/funds/fund-status.enum";
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


@injectable()
export class SipCreationUseCase implements ISipCreationUseCase {

    constructor(
        @inject(USER_TYPES.UserRepository) private readonly _userRepository: IUserRepository,
        @inject(USER_TYPES.WalletRepository) private readonly _walletRepository: IWalletRepository,
        @inject(MUTUAL_FUND_TYPES.MutualFundRepository) private readonly _mutualFundRepository: IMutualFundRepository,
        @inject(SIP_TYPES.SipRepository) private readonly _sipRepository: ISipRepository,
        @inject(SIP_TYPES.SipInstallmentRepository) private readonly _sipInstallmentRepository: ISipInstallmentRepository,
        @inject(SUBSCRIPTION_TYPES.FeatureAccessService) private readonly _featureAccess: IFeatureAccessService,
        @inject(EXTERNAL_TYPES.IdempotencyService) private readonly _idempotencyService: IIdempotencyService,
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

                const user = await this._userRepository.findById(userId, session);
                if (!user) throw new NotFoundError(ErrorMessages.AUTH.USER_NOT_FOUND);

                if (!user.isVerified) throw new ValidationError(ErrorMessages.AUTH.COMPLETE_KYC);

                const wallet = await this._walletRepository.findOne({ userId });
                if (!wallet) throw new NotFoundError(ErrorMessages.PAYMENT.WALLET_NOT_FOUND);

                const fund = await this._mutualFundRepository.findBySchemeCode(
                    schemeCode,
                    session
                );
                if (!fund || fund.status === FundStatus.INACTIVE) {
                    throw new ValidationError(ErrorMessages.MUTUAL_FUND.FUND_INACTIVE);
                }

                if (wallet.balance < amount) {
                    throw new ValidationError(ErrorMessages.PAYMENT.INSUFFICIENT_BALANCE);
                }

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
