export const SUBSCRIPTION_TYPES = {
    SubscriptionRepository: Symbol.for("SubscriptionRepository"),
    PlanRepository: Symbol.for("PlanRepository"),

    SubscriptionPlansUseCase: Symbol.for("SubscriptionPlansUseCase"),
    FetchSubscriptionsUseCase: Symbol.for("FetchSubscriptionsUseCase"),
    SubscriptionStatsUseCase: Symbol.for("SubscriptionStatsUseCase"),

    AdminSubscriptionManagementController: Symbol.for("AdminSubscriptionManagementController"),

} as const
