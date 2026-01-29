import { container } from '@infrastructure/inversify_di/container';
import { Routes } from '@presentation/express/utils/constants/feature-routes.constants';
import { MutualFundsAdminController } from '@presentation/http/controllers/mutual-funds/mutual-fund-admin.controller';
import express from 'express';
const router = express.Router();

const mutualFundController = container.get<MutualFundsAdminController>(MutualFundsAdminController);

router.post(Routes.ADD_FUNDS, mutualFundController.addFunds.bind(mutualFundController));
router.get("/list", mutualFundController.fetchAllFunds.bind(mutualFundController));
router.patch("/:fundId/status", mutualFundController.updateStatus.bind(mutualFundController));

export default router;