import { container } from "@infrastructure/inversify_di/container";
import { STOCK_TYPES } from "@infrastructure/inversify_di/features/stock/stock.types";
import { UserStocksController } from "@presentation/http/controllers/stocks/user-stocks.controller";
import { StockTradingRoutes } from "@shared/routes/stock-trading.routes";
import { Router } from "express";

const router = Router();
const userStocksController = container.get<UserStocksController>(STOCK_TYPES.UserStocksController);

router.get(StockTradingRoutes.DEFAUTL, userStocksController.getStocks.bind(userStocksController));
router.get(StockTradingRoutes.GET_STOCKS, userStocksController.getStockDetails.bind(userStocksController));
router.get(StockTradingRoutes.GET_CANDLES, userStocksController.getStockCandles.bind(userStocksController));

export default router;
