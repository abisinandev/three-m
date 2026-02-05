import { ADMIN_TYPES } from '@infrastructure/inversify_di/features/admin/admin.types';
import { container } from '@infrastructure/inversify_di/container';
import { AdminSipController } from '@presentation/http/controllers/admin/admin-sip.controller';
import { Router } from 'express'
import { AdminSipRoutes } from '@shared/routes/admin.routes';
const router = Router();

const sipController = container.get<AdminSipController>(ADMIN_TYPES.AdminSipController);

router.get(AdminSipRoutes.LIST_ALL, sipController.listAllSips.bind(sipController));
router.get(AdminSipRoutes.FETCH_DETAILS, sipController.fetchSipDetails.bind(sipController));
router.patch(AdminSipRoutes.BLOCK_SIP, sipController.blockSip.bind(sipController));

export default router;