import { UpdatePlanDTO } from '@application/dto/admin/subscription/update-plan.dto';
import { container } from '@infrastructure/inversify_di/container';
import { SUBSCRIPTION_TYPES } from '@infrastructure/inversify_di/features/subscription/subscription.types';
import { validateDTO } from '@presentation/express/middlewares/validation-dto.middlewares';
import { AdminSubscriptionManagementController } from '@presentation/http/controllers/admin/admin-subscription-management.controller';
import { AdminSubscriptionRoutes } from '@shared/routes/admin.routes';
import { Router } from 'express';

const router = Router();

const controller = container.get<AdminSubscriptionManagementController>(
    SUBSCRIPTION_TYPES.AdminSubscriptionManagementController
);

router.get(AdminSubscriptionRoutes.FETCH_PLANS, controller.getPlans.bind(controller));
router.get(AdminSubscriptionRoutes.FETCH_STATS, controller.getStats.bind(controller));
router.get(AdminSubscriptionRoutes.FETCH_SUBSCRIPTIONS, controller.getSubscriptions.bind(controller));
router.patch(AdminSubscriptionRoutes.UPDATE_PLAN, validateDTO(UpdatePlanDTO), controller.updatePlan.bind(controller));

export default router;