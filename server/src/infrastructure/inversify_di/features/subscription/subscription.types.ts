export const SUBSCRIPTION_TYPES = {
    SubscriptionRepository: Symbol.for("SubscriptionRepository"),
    PlanRepository: Symbol.for("PlanRepository"),

    SubscriptionPlansUseCase: Symbol.for("SubscriptionPlansUseCase"),
    UpdateAdminPlanUseCase: Symbol.for("UpdateAdminPlanUseCase"),
    FetchSubscriptionsUseCase: Symbol.for("FetchSubscriptionsUseCase"),
    SubscriptionStatsUseCase: Symbol.for("SubscriptionStatsUseCase"),
    FetchPremiumPlanUseCase: Symbol.for("FetchPremiumPlanUseCase"),

    AdminSubscriptionManagementController: Symbol.for("AdminSubscriptionManagementController"),
    UserSubscriptionController: Symbol.for("UserSubscriptionController"),

} as const
