import { ConfirmRedeemDTO } from "@application/dto/portfolio/confirm-radeem-dto";
import { container } from "@infrastructure/inversify_di/container";
import { validateDTO } from "@presentation/express/middlewares/validation-dto.middlewares";
import { PortFolioController } from "@presentation/http/controllers/portfolio/portfolio.controller";
import { Router } from "express"
const router = Router()

const portfolioController = container.get<PortFolioController>(PortFolioController);

router.get("/", portfolioController.listAllInvestments.bind(portfolioController));
router.get("/datas", portfolioController.portfolioCalculation.bind(portfolioController));
router.get('/redeem-investment', portfolioController.redeemInvestments.bind(portfolioController));
router.patch("/confirm-redeem", validateDTO(ConfirmRedeemDTO), portfolioController.confirmRedeem.bind(portfolioController));
export default router;