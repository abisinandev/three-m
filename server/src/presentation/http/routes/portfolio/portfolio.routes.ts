import { ConfirmRedeemDTO } from "@application/dto/portfolio/confirm-radeem-dto";
import { container } from "@infrastructure/inversify_di/container";
import { validateDTO } from "@presentation/express/middlewares/validation-dto.middlewares";
import { PortFolioController } from "@presentation/http/controllers/portfolio/portfolio.controller";
import { PortfolioRoutes } from "@shared/routes/portfolio.routes";
import { Router } from "express"
const router = Router()

const controller = container.get<PortFolioController>(PortFolioController);

router.get(PortfolioRoutes.SUMMARY, controller.portfolioSummary.bind(controller));
router.get(PortfolioRoutes.RETURN_XIRR, controller.xirrCalculation.bind(controller));

router.get(PortfolioRoutes.REDEEM_INVESTMENT, controller.redeemInvestments.bind(controller));
router.patch(PortfolioRoutes.CONFIRM_REDEEM, validateDTO(ConfirmRedeemDTO), controller.confirmRedeem.bind(controller));
router.get(PortfolioRoutes.ASSETS, controller.listAssets.bind(controller));
router.get(PortfolioRoutes.MF_ASSETS, controller.listMFAssets.bind(controller));
router.get(PortfolioRoutes.STOCK_ASSETS, controller.listStockAssets.bind(controller));
router.get(PortfolioRoutes.TRADE_HISTORY, controller.listTradeHistory.bind(controller));
router.get(PortfolioRoutes.HISTORIES, controller.listTradeHistory.bind(controller));

router.get("/projection", controller.returnProjection.bind(controller));

export default router;