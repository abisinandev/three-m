import { inject, injectable } from "inversify";
import { IUpgradePremiumUseCase } from "./interfaces/upgrade-premium-usecase.interface";
import { USER_TYPES } from "@infrastructure/inversify_di/features/user/user.types";
import { IUserRepository } from "@application/interfaces/repositories/user/user-repository.interface";
import { ITransactionRepository } from "@application/interfaces/repositories/feature/transaction-repository.interface";
import { UpgradePremiumDTO } from "@application/dto/subscription/upgrade-premium.dto";
import { SUBSCRIPTION_TYPES } from "@infrastructure/inversify_di/features/subscription/subscription.types";
import { ISubscriptionRepository } from "@application/interfaces/repositories/subscriptions/subscriptions-repository.interface";
import { NotFoundError, ValidationError } from "@presentation/express/utils/error-handling";
import { ErrorMessages } from "@shared/constants/error.messages";
import { SubscriptionEntity } from "@domain/entities/subscription/subscription.entity";
import { IPlanRepository } from "@application/interfaces/repositories/subscriptions/plan-repository.interface";
import { SubscriptionPlans } from "@domain/entities/subscription/enums/plans.enum";
import { TransactionEntity } from "@domain/entities/transaction/transaction.entity";
import { TransactionTypes } from "@domain/enum/wallet/transaction-types.enum";
import { TransactionReferenceType } from "@domain/enum/wallet/transaction-reference-type";
import { TransactionStatus } from "@domain/enum/wallet/transaction-status.enum";
import mongoose from "mongoose";

@injectable()
export class UpgradePremiumUseCase implements IUpgradePremiumUseCase {
    constructor(
        @inject(USER_TYPES.TransactionRepository) private readonly _transactionRepository: ITransactionRepository,
        @inject(USER_TYPES.UserRepository) private readonly _userRepository: IUserRepository,
        @inject(SUBSCRIPTION_TYPES.SubscriptionRepository) private readonly _subscriptionRepository: ISubscriptionRepository,
        @inject(SUBSCRIPTION_TYPES.PlanRepository) private readonly _planRepository: IPlanRepository,
    ) { }

    async execute(data: UpgradePremiumDTO): Promise<void> {

        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const user = await this._userRepository.findById(data.userId);
            if (!user) throw new NotFoundError(ErrorMessages.AUTH.USER_NOT_FOUND);
            if (!user.isVerified) throw new ValidationError(ErrorMessages.USER.NOT_VERIFIED);

            const plan = await this._planRepository.findByCode(SubscriptionPlans.PREMIUM);
            if (!plan) throw new NotFoundError(ErrorMessages.SUBSCRIPTION.PLAN_NOT_FOUND);

            let subscription = await this._subscriptionRepository.findByUserId(data.userId);

            if (!subscription) {
                subscription = SubscriptionEntity.create({
                    userId: data.userId,
                    planCode: SubscriptionPlans.PREMIUM,
                    durationInDays: plan.durationInDays,
                });
                await this._subscriptionRepository.create(subscription, session);
            } else {
                subscription.renew(SubscriptionPlans.PREMIUM, plan.durationInDays);
                await this._subscriptionRepository.update(subscription.id as string, subscription.toPersistence(), session);
            }

            const transaction = TransactionEntity.create({
                userId: data.userId,
                userCode: user.userCode || "",
                amount: data.amount,
                currency: data.currency,
                type: TransactionTypes.SUBSCRIPTION,
                referenceType: TransactionReferenceType.STRIPE,
                referenceId: subscription.id as string,
                paymentIntentId: data.paymentIntentId,
                status: TransactionStatus.SUCCESSFUL,
                paymentStatus: data.paymentStatus,
                receipt_url: data.receipt_url,
                isVerified: true//Change📌📌
            });

            await this._transactionRepository.createTransaction(transaction, session);

            user.subscribePlan();
            await this._userRepository.update(user.id as string, user, session);

            await session.commitTransaction();
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    }
}
