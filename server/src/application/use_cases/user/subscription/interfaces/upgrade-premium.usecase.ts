import { inject, injectable } from "inversify";
import { IUpgradePremiumUseCase } from "./upgrade-premium-usecase.interface";
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

        const session = mongoose.startSession()
        try {
            (await session).startTransaction();

            const user = await this._userRepository.findById(data.userId);
            if (!user) throw new NotFoundError(ErrorMessages.AUTH.USER_NOT_FOUND);
            if (!user.isVerified) throw new ValidationError(ErrorMessages.USER.NOT_VERIFIED);

            const plan = await this._planRepository.findByCode(SubscriptionPlans.PREMIUM);

            const subscription = await this._subscriptionRepository.findByUserId(data.userId);
            if (!subscription) {
                const newSubscription = SubscriptionEntity.create({
                    durationInDays: plan?.durationInDays as number,
                    planCode: plan?.code as SubscriptionPlans,
                    userId: data.userId,
                })

                await this._subscriptionRepository.create(newSubscription);
            } else {

            }
 
        } catch (error) {

        }
    }
}