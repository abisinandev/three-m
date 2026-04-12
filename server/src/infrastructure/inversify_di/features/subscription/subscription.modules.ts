import { ISubscriptionRepository } from "@application/interfaces/repositories/subscriptions/subscriptions-repository.interface";
import { ContainerModule } from "inversify";
import { SUBSCRIPTION_TYPES } from "./subscription.types";
import { SubscriptionRepository } from "@infrastructure/databases/repository/subscription/subscription.repository";
import { IPlanRepository } from "@application/interfaces/repositories/subscriptions/plan-repository.interface";
import { PlanRepository } from "@infrastructure/databases/repository/subscription/plan.repository";

export const SubscriptionModule = new ContainerModule(({ bind }) => {
    bind<ISubscriptionRepository>(SUBSCRIPTION_TYPES.SubscriptionRepository).to(SubscriptionRepository);
    bind<IPlanRepository>(SUBSCRIPTION_TYPES.PlanRepository).to(PlanRepository);
})