import { InvestmentDTO } from '@application/dto/mutual-funds/investment-dto';
import { container } from '@infrastructure/inversify_di/inversify.di';
import { validateDTO } from '@presentation/express/middlewares/validation-dto.middlewares';
import { Routes } from '@presentation/express/utils/constants/user-routes.constants';
import { MutualFundUserController } from '@presentation/http/controllers/mutual-funds/mutual-fund-user.controller';
import { Router } from 'express'
const router = Router();

const mutualFundUserController = container.get<MutualFundUserController>(MutualFundUserController);

router.get("/lists", mutualFundUserController.fetchFunds.bind(mutualFundUserController));
router.get("/investments", mutualFundUserController.listInvestments.bind(mutualFundUserController));
router.get(Routes.MF_FUND, mutualFundUserController.fetchFundDetails.bind(mutualFundUserController));
router.post('/investment/one-time', validateDTO(InvestmentDTO), mutualFundUserController.investment.bind(mutualFundUserController));


export default router; 