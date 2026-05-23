import { container } from "@infrastructure/inversify_di/container";
import { SUBSCRIPTION_TYPES } from "@infrastructure/inversify_di/features/subscription/subscription.types";
import { UserSubscriptionController } from "@presentation/http/controllers/user/user-subscription.controller";
import { UserSubscriptionRoutes } from "@shared/routes/user.routes";
import { Router } from "express";

const router = Router();

const subscriptionController = container.get<UserSubscriptionController>(SUBSCRIPTION_TYPES.UserSubscriptionController);

router.get(UserSubscriptionRoutes.GET_PREMIUM_PLAN, subscriptionController.getPremiumPlan.bind(subscriptionController));

export default router;
