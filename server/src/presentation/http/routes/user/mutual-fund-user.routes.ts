import { container } from '@infrastructure/inversify_di/inversify.di';
import { Routes } from '@presentation/express/utils/constants/user-routes.constants';
import { MutualFundUserController } from '@presentation/http/controllers/mutual-funds/mutual-fund-user.controller';
import { Router } from 'express'
const router = Router();

const mutualFundUserController = container.get<MutualFundUserController>(MutualFundUserController);

router.get("/lists", mutualFundUserController.fetchFunds.bind(mutualFundUserController));
router.get(Routes.MF_FUND, mutualFundUserController.fetchFundDetails.bind(mutualFundUserController));
// router.get("/:schemeCode/history", mutualFundUserController.fetchNavHistory.bind(mutualFundUserController));
export default router;