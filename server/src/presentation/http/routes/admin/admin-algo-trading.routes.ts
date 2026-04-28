import { container } from '@infrastructure/inversify_di/container';
import { ALGO_TRADING_TYPES } from '@infrastructure/inversify_di/features/algo-trading/algo-trading.type';
import { AdminAlgoTradingController } from '@presentation/http/controllers/admin/admin-algo-trading.controller';
import { Router } from 'express';

const router = Router();
const controller = container.get<AdminAlgoTradingController>(ALGO_TRADING_TYPES.AdminAlgoTradingController);

router.get("/", controller.getAlgoTrading.bind(controller));
router.get("/base-strategies", controller.getBaseStrategies.bind(controller));
router.put("/risk-config", controller.updateRiskConfig.bind(controller));
router.get("/strategies", controller.getStrategies.bind(controller));
router.get("/signals", controller.getSignals.bind(controller));
router.get("/trades", controller.getAlgoTrades.bind(controller));

export default router;