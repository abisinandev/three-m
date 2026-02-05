import { InvestmentDTO } from '@application/dto/mutual-funds/investment-dto';
import { container } from '@infrastructure/inversify_di/container';
import { validateDTO } from '@presentation/express/middlewares/validation-dto.middlewares';
import { UserMutualFundRoutes, UserRoutes } from '@shared/routes/user.routes';
import { MutualFundUserController } from '@presentation/http/controllers/mutual-funds/mutual-fund-user.controller';
import { Router } from 'express'
const router = Router();

const mutualFundUserController = container.get<MutualFundUserController>(MutualFundUserController);

router.get(UserMutualFundRoutes.LISTS, mutualFundUserController.fetchFunds.bind(mutualFundUserController));
router.get(UserMutualFundRoutes.INVESTMENTS, mutualFundUserController.listInvestments.bind(mutualFundUserController));
router.get(UserRoutes.MF_FUND, mutualFundUserController.fetchFundDetails.bind(mutualFundUserController));
router.post(UserMutualFundRoutes.INVESTMENT_ONE_TIME, validateDTO(InvestmentDTO), mutualFundUserController.investment.bind(mutualFundUserController));

export default router; 