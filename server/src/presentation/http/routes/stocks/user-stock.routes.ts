import { container } from "@infrastructure/inversify_di/container";
import { STOCK_TYPES } from "@infrastructure/inversify_di/features/stock/stock.types";
import { UserStocksController } from "@presentation/http/controllers/stocks/user-stocks.controller";
import { Router } from "express";

const router = Router();
const userStocksController = container.get<UserStocksController>(STOCK_TYPES.UserStocksController);

router.get('/', userStocksController.getStocks.bind(userStocksController));
router.get('/:symbol', userStocksController.getStockDetails.bind(userStocksController));
router.get('/:symbol/candles', userStocksController.getStockCandles.bind(userStocksController));

export default router;
