import { ConfirmRedeemDTO } from "@application/dto/portfolio/confirm-radeem-dto";
import { container } from "@infrastructure/inversify_di/container";
import { validateDTO } from "@presentation/express/middlewares/validation-dto.middlewares";
import { PortFolioController } from "@presentation/http/controllers/portfolio/portfolio.controller";
import { PortfolioRoutes } from "@shared/routes/portfolio.routes";
import { Router } from "express"
const router = Router()

const portfolioController = container.get<PortFolioController>(PortFolioController);

router.get(PortfolioRoutes.LIST_ALL, portfolioController.listAllInvestments.bind(portfolioController));
router.get(PortfolioRoutes.DATAS, portfolioController.portfolioCalculation.bind(portfolioController));
router.get(PortfolioRoutes.RETURN_XIRR, portfolioController.xirrCalculation.bind(portfolioController));

router.get(PortfolioRoutes.REDEEM_INVESTMENT, portfolioController.redeemInvestments.bind(portfolioController));
router.patch(PortfolioRoutes.CONFIRM_REDEEM, validateDTO(ConfirmRedeemDTO), portfolioController.confirmRedeem.bind(portfolioController));

export default router;