import { container } from '@infrastructure/inversify_di/container';
import { STOCK_TYPES } from '@infrastructure/inversify_di/features/stock/stock.types';
import { AlgoTradingController } from '@presentation/http/controllers/algo-trading/algo-trading.controller';
import { AlgoTradingRoutes } from '@shared/routes';
import { Router } from 'express'
const router = Router();

const controller = container.get<AlgoTradingController>(STOCK_TYPES.AlgoTradingController);

router.get(AlgoTradingRoutes.GET_STRATEGIES, controller.getStrategies.bind(controller));
router.get(AlgoTradingRoutes.GET_ACTIVE_STRATEGY, controller.getActiveStrategy.bind(controller));
router.post(AlgoTradingRoutes.SAVE_STRATEGY, controller.saveStrategy.bind(controller));
router.post(AlgoTradingRoutes.TOGGLE_STRATEGY_STATUS, controller.TurnOnStrategy.bind(controller));
router.post(AlgoTradingRoutes.CONFIRM_SIGNAL, controller.confirmSignal.bind(controller));

export default router;