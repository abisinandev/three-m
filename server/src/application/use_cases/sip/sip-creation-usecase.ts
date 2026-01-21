import { inject, injectable } from "inversify";
import { ISipCreationUseCase } from "../interfaces/features/sip/sip-creation-usecase.interface";
import { SipCreationDTO } from "@application/dto/sip/sip-creation.dto";
import mongoose from "mongoose";
import { USER_TYPES } from "@infrastructure/inversify_di/types/user/user.types";
import { FEATURE_TYPES } from "@infrastructure/inversify_di/types/feature/feature.type";
import { IUserRepository } from "@application/interfaces/repositories/user/user-repository.interface";
import { IWalletRepository } from "@application/interfaces/repositories/user/wallet-repository.interface";
import { IMutualFundRepository } from "@application/interfaces/repositories/feature/mutual-fund-repository.interface";
import { ErrorMessage } from "@domain/enum/express/messages/error.message";
import { NotFoundError, ValidationError } from "@presentation/express/utils/error-handling";
import { FundStatus } from "@domain/enum/funds/fund-status.enum";
import { ISipRepository } from "@application/interfaces/repositories/feature/sip-repository.interface";
import { SipEntity } from "@domain/entities/mutual-fund/sip.entity";
import { ISipInstallmentRepository } from "@application/interfaces/repositories/feature/sip-intallment-repository.interface";
import { SipInstallmentEntity } from "@domain/entities/mutual-fund/sip-intallment.entity";
import AppError from "@presentation/express/utils/error-handling/app.error";

@injectable()
export class SipCreationUseCase implements ISipCreationUseCase {

    constructor(
        @inject(USER_TYPES.UserRepository) private readonly _userRepository: IUserRepository,
        @inject(USER_TYPES.WalletRepository) private readonly _walletRepository: IWalletRepository,
        @inject(FEATURE_TYPES.MutualFundRepository) private readonly _mutualFundRepository: IMutualFundRepository,
        @inject(FEATURE_TYPES.SipRepository) private readonly _sipRepository: ISipRepository,
        @inject(FEATURE_TYPES.SipInstallmentRepository) private readonly _sipInstallmentRepository: ISipInstallmentRepository
    ) { }
    async execute(data: SipCreationDTO, userId: string): Promise<void> {
        const session = await mongoose.startSession();

        try {
            await session.withTransaction(async () => {
                const { amount, frequency, schemeCode, startDate, totalInstallments } = data;

                const user = await this._userRepository.findById(userId, session);
                if (!user) throw new NotFoundError(ErrorMessage.USER_NOT_FOUND);

                const wallet = await this._walletRepository.findOne({ userId });
                if (!wallet) throw new NotFoundError(ErrorMessage.WALLET_NOT_FOUND);

                const fund = await this._mutualFundRepository.findBySchemeCode(
                    schemeCode,
                    session
                );
                if (!fund || fund.status === FundStatus.INACTIVE) {
                    throw new ValidationError(ErrorMessage.FUND_INACTIVE);
                }

                if (wallet.balance < amount) {
                    throw new ValidationError(ErrorMessage.INSUFFICIENT_BALANCE);
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

                console.log('[SipCreationUseCase] Created SIP:', {
                    sipId: createdSip.id,
                    userId: createdSip.userId,
                    schemeCode: createdSip.schemeCode
                });

                const installment = SipInstallmentEntity.create({
                    sipId: createdSip.id as string,
                    userId: createdSip.userId,
                    schemeCode: createdSip.schemeCode,
                    installmentNo: 1,
                    executionDate: createdSip.nextExecutionDate,
                    amount: createdSip.amount,

                });

                console.log('[SipCreationUseCase] Creating first installment:', {
                    sipId: installment.sipId,
                    userId: installment.userId,
                    installmentNo: installment.installmentNo
                });

                await this._sipInstallmentRepository.create(installment, session);

                console.log('[SipCreationUseCase] First installment created successfully');
            });
        } finally {
            await session.endSession();
        }
    }
}
