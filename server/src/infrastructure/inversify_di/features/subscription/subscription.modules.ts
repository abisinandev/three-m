import { ContainerModule } from "inversify";
import { SUBSCRIPTION_TYPES } from "./subscription.types";
import { ISubscriptionRepository } from "@application/interfaces/repositories/subscriptions/subscriptions-repository.interface";
import { SubscriptionRepository } from "@infrastructure/databases/repository/subscription/subscription.repository";
import { IPlanRepository } from "@application/interfaces/repositories/subscriptions/plan-repository.interface";
import { PlanRepository } from "@infrastructure/databases/repository/subscription/plan.repository";
import { AdminSubscriptionManagementController } from "@presentation/http/controllers/admin/admin-subscription-management.controller";
import { ISubscriptionPlansUseCase } from "@application/use_cases/admin/subscription-management/interfaces/subscription-plans-usecase.interface";
import { SubscriptionPlansUseCase } from "@application/use_cases/admin/subscription-management/subscription-plans.usecase";
import { IFetchSubscriptionsUseCase } from "@application/use_cases/admin/subscription-management/interfaces/fetch-subscriptions-usecase.interface";
import { FetchSubscriptionsUseCase } from "@application/use_cases/admin/subscription-management/fetch-subscriptions.usecase";
import { ISubscriptionStatsUseCase } from "@application/use_cases/admin/subscription-management/interfaces/subscription-stats-usecase.interface";
import { SubscriptionStatsUseCase } from "@application/use_cases/admin/subscription-management/subscription-stats.usecase";

export const SubscriptionModule = new ContainerModule(({ bind }) => {
    bind<ISubscriptionRepository>(SUBSCRIPTION_TYPES.SubscriptionRepository).to(SubscriptionRepository);
    bind<IPlanRepository>(SUBSCRIPTION_TYPES.PlanRepository).to(PlanRepository);

    bind<ISubscriptionPlansUseCase>(SUBSCRIPTION_TYPES.SubscriptionPlansUseCase).to(SubscriptionPlansUseCase);
    bind<IFetchSubscriptionsUseCase>(SUBSCRIPTION_TYPES.FetchSubscriptionsUseCase).to(FetchSubscriptionsUseCase);
    bind<ISubscriptionStatsUseCase>(SUBSCRIPTION_TYPES.SubscriptionStatsUseCase).to(SubscriptionStatsUseCase);

    bind<AdminSubscriptionManagementController>(SUBSCRIPTION_TYPES.AdminSubscriptionManagementController).to(AdminSubscriptionManagementController);
});