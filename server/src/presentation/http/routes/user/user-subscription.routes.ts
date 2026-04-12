import { container } from "@infrastructure/inversify_di/container";
import { SUBSCRIPTION_TYPES } from "@infrastructure/inversify_di/features/subscription/subscription.types";
import { UserSubscriptionController } from "@presentation/http/controllers/user/user-subscription.controller";
import { Router } from "express";

const router = Router();

const subscriptionController = container.get<UserSubscriptionController>(SUBSCRIPTION_TYPES.UserSubscriptionController);

router.get("/premium", subscriptionController.getPremiumPlan.bind(subscriptionController));

export default router;
