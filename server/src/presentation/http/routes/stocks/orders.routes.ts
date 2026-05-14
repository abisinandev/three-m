import { container } from '@infrastructure/inversify_di/container';
import { STOCK_TYPES } from '@infrastructure/inversify_di/features/stock/stock.types';
import { OrdersController } from '@presentation/http/controllers/stocks/orders.controller';
import { Router } from 'express';
import { validateDTO } from '@presentation/express/middlewares/validation-dto.middlewares';
import { BuyOrderDTO } from '@application/dto/stocks/buy-order.dto';
import { SellOrderDTO } from "@application/dto/stocks/sell-order.dto";
import { LimitBuyOrderDTO, LimitSellOrderDTO } from "@application/dto/stocks/limit-order.dto";
import { OrderRoutes } from '@shared/routes/stock-trading.routes';

const router = Router();
const controller = container.get<OrdersController>(STOCK_TYPES.OrdersController);

router.get(OrderRoutes.PENDING, controller.getPendingOrders.bind(controller));
router.post(OrderRoutes.BUY, validateDTO(BuyOrderDTO), controller.buy.bind(controller));
router.post(OrderRoutes.SELL, validateDTO(SellOrderDTO), controller.sell.bind(controller));
router.post(OrderRoutes.LIMIT_BUY, validateDTO(LimitBuyOrderDTO), controller.limitBuy.bind(controller));
router.post(OrderRoutes.LIMIT_SELL, validateDTO(LimitSellOrderDTO), controller.limitSell.bind(controller));
router.delete(OrderRoutes.CANCEL, controller.cancelLimitOrder.bind(controller));


export default router;
