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
import { IUpdateAdminPlanUseCase } from "@application/use_cases/admin/subscription-management/interfaces/update-admin-plan-usecase.interface";
import { UpdateAdminPlanUseCase } from "@application/use_cases/admin/subscription-management/update-admin-plan.usecase";
import { ISubscriptionStatsUseCase } from "@application/use_cases/admin/subscription-management/interfaces/subscription-stats-usecase.interface";
import { SubscriptionStatsUseCase } from "@application/use_cases/admin/subscription-management/subscription-stats.usecase";
import { IFetchPremiumPlanUseCase } from "@application/use_cases/user/subscription/interfaces/fetch-premium-plan.usecase.interface";
import { FetchPremiumPlanUseCase } from "@application/use_cases/user/subscription/fetch-premium-plan.usecase";
import { UserSubscriptionController } from "@presentation/http/controllers/user/user-subscription.controller";
import { IFeatureAccessService } from "@application/interfaces/services/subscription/feature-access-service.interface";
import { FeatureAccessService } from "@application/services/subscription/feature-access.service";
import { IUpgradePremiumUseCase } from "@application/use_cases/user/subscription/interfaces/upgrade-premium-usecase.interface";
import { UpgradePremiumUseCase } from "@application/use_cases/user/subscription/upgrade-premium.usecase";
import { IGetUserPlanUseCase } from "@application/use_cases/user/subscription/interfaces/get-user-plan.usecase.interface";
import { GetUserPlanUseCase } from "@application/use_cases/user/subscription/get-user-plan.usecase";

export const SubscriptionModule = new ContainerModule(({ bind }) => {
    bind<ISubscriptionRepository>(SUBSCRIPTION_TYPES.SubscriptionRepository).to(SubscriptionRepository);
    bind<IPlanRepository>(SUBSCRIPTION_TYPES.PlanRepository).to(PlanRepository);

    bind<ISubscriptionPlansUseCase>(SUBSCRIPTION_TYPES.SubscriptionPlansUseCase).to(SubscriptionPlansUseCase);
    bind<IUpdateAdminPlanUseCase>(SUBSCRIPTION_TYPES.UpdateAdminPlanUseCase).to(UpdateAdminPlanUseCase);
    bind<IFetchSubscriptionsUseCase>(SUBSCRIPTION_TYPES.FetchSubscriptionsUseCase).to(FetchSubscriptionsUseCase);
    bind<ISubscriptionStatsUseCase>(SUBSCRIPTION_TYPES.SubscriptionStatsUseCase).to(SubscriptionStatsUseCase);
    bind<IFetchPremiumPlanUseCase>(SUBSCRIPTION_TYPES.FetchPremiumPlanUseCase).to(FetchPremiumPlanUseCase);

    bind<AdminSubscriptionManagementController>(SUBSCRIPTION_TYPES.AdminSubscriptionManagementController).to(AdminSubscriptionManagementController);
    bind<UserSubscriptionController>(SUBSCRIPTION_TYPES.UserSubscriptionController).to(UserSubscriptionController);

    bind<IFeatureAccessService>(SUBSCRIPTION_TYPES.FeatureAccessService).to(FeatureAccessService);

    bind<IUpgradePremiumUseCase>(SUBSCRIPTION_TYPES.UpgradePremiumUseCase).to(UpgradePremiumUseCase);
    bind<IGetUserPlanUseCase>(SUBSCRIPTION_TYPES.GetUserPlanUseCase).to(GetUserPlanUseCase);
});