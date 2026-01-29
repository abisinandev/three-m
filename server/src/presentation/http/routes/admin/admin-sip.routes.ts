import { ADMIN_TYPES } from '@infrastructure/inversify_di/features/admin/admin.types';
import { container } from '@infrastructure/inversify_di/container';
import { AdminSipController } from '@presentation/http/controllers/admin/admin-sip.controller';
import { Router } from 'express'
const router = Router();

const sipController = container.get<AdminSipController>(ADMIN_TYPES.AdminSipController);

router.get('/', sipController.listAllSips.bind(sipController));
router.get('/:sipId', sipController.fetchSipDetails.bind(sipController));
router.patch('/block/:sipId', sipController.blockSip.bind(sipController));

export default router;