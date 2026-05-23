import { container } from '@infrastructure/inversify_di/container';
import { ALGO_TRADING_TYPES } from '@infrastructure/inversify_di/features/algo-trading/algo-trading.type';
import { AdminAlgoTradingController } from '@presentation/http/controllers/admin/admin-algo-trading.controller';
import { AdminAlgoTradingRoutes } from '@shared/routes/admin.routes';
import { Router } from 'express';

const router = Router();
const controller = container.get<AdminAlgoTradingController>(ALGO_TRADING_TYPES.AdminAlgoTradingController);

router.get(AdminAlgoTradingRoutes.STATS, controller.getAlgoTrading.bind(controller));
router.get(AdminAlgoTradingRoutes.BASE_STRATEGIES, controller.getBaseStrategies.bind(controller));
router.put(AdminAlgoTradingRoutes.RISK_CONFIG, controller.updateRiskConfig.bind(controller));
router.get(AdminAlgoTradingRoutes.STRATEGIES, controller.getStrategies.bind(controller));
router.get(AdminAlgoTradingRoutes.SIGNALS, controller.getSignals.bind(controller));
router.get(AdminAlgoTradingRoutes.TRADES, controller.getAlgoTrades.bind(controller));

export default router;