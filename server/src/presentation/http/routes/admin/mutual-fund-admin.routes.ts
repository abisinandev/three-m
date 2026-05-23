import { container } from '@infrastructure/inversify_di/container';
import { AdminMutualFundRoutes } from '@shared/routes/admin.routes';
import { MutualFundsAdminController } from '@presentation/http/controllers/mutual-funds/mutual-fund-admin.controller';
import express from 'express';
const router = express.Router();

const mutualFundController = container.get<MutualFundsAdminController>(MutualFundsAdminController);

router.post(AdminMutualFundRoutes.ADD_FUNDS, mutualFundController.addFunds.bind(mutualFundController));
router.get(AdminMutualFundRoutes.LIST_FUNDS, mutualFundController.fetchAllFunds.bind(mutualFundController));
router.patch(AdminMutualFundRoutes.UPDATE_STATUS, mutualFundController.updateStatus.bind(mutualFundController));

export default router;