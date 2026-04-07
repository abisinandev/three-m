import { container } from '@infrastructure/inversify_di/container';
import { STOCK_TYPES } from '@infrastructure/inversify_di/features/stock/stock.types';
import { AlgoTradingController } from '@presentation/http/controllers/algo-trading/algo-trading.controller';
import { Router } from 'express'
const router = Router();

const controller = container.get<AlgoTradingController>(STOCK_TYPES.AlgoTradingController);

router.get('/strategies', controller.getStrategies.bind(controller));

export default router;