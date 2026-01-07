import { container } from '@infrastructure/inversify_di/inversify.di';
import { MutualFundUserController } from '@presentation/http/controllers/mutual-funds/mutual-fund-user.controller';
import { Router } from 'express'
const router = Router();

const mutualFundUserController = container.get<MutualFundUserController>(MutualFundUserController);

router.get("/lists", mutualFundUserController.fetchFunds.bind(mutualFundUserController));

export default router;