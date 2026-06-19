import { container } from '@infrastructure/inversify_di/container';
import { ALGO_TRADING_TYPES } from '@infrastructure/inversify_di/features/algo-trading/algo-trading.type';
import { AdminTradesController } from '@presentation/http/controllers/admin/admin-trades.controller';
import { AdminTradesRoutes } from '@shared/routes/admin.routes';
import { Router } from 'express';

const router = Router();
const controller = container.get<AdminTradesController>(ALGO_TRADING_TYPES.AdminAlgoTradingController);

router.get(AdminTradesRoutes.STATS, controller.getAlgoTrading.bind(controller));
router.get(AdminTradesRoutes.BASE_STRATEGIES, controller.getBaseStrategies.bind(controller));
router.put(AdminTradesRoutes.RISK_CONFIG, controller.updateRiskConfig.bind(controller));
router.get(AdminTradesRoutes.STRATEGIES, controller.getStrategies.bind(controller));
router.get(AdminTradesRoutes.SIGNALS, controller.getSignals.bind(controller));
router.get(AdminTradesRoutes.TRADES, controller.getAlgoTrades.bind(controller));
router.get(AdminTradesRoutes.ALL_TRADES, controller.getAllTrades.bind(controller));

export default router;