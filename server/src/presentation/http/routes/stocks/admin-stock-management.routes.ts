import { Router } from "express";
import { container } from "@infrastructure/inversify_di/container";
import { ADMIN_TYPES } from "@infrastructure/inversify_di/features/admin/admin.types";
import { AdminStocksController } from "@presentation/http/controllers/admin/admin-stocks.controller";
import { AdminStockRoutes } from "@shared/routes/admin.routes";

const router = Router();

const adminStocksController = container.get<AdminStocksController>(ADMIN_TYPES.AdminStocksController);

router.get(AdminStockRoutes.LIST_STOCKS, adminStocksController.getStocks.bind(adminStocksController));
router.get(AdminStockRoutes.SEARCH_STOCKS, adminStocksController.searchStocks.bind(adminStocksController));
router.post(AdminStockRoutes.ADD_STOCK, adminStocksController.addStock.bind(adminStocksController));
router.patch(AdminStockRoutes.UPDATE_STATUS, adminStocksController.updateStatus.bind(adminStocksController));

export default router;
