import api from "@lib/axiosUser";
import { API_ROUTES } from "@shared/constants/apiRoutes";
import type { 
  BuyOrderRequest, 
  LimitBuyOrderRequest, 
  LimitSellOrderRequest, 
  OrderResponse, 
  OrderType, 
  PendingOrder, 
  SellOrderRequest 
} from "@shared/types/stock/stock.types";

export const ORDER_TYPES: Record<string, OrderType> = {
  MARKET: "MARKET_ORDER",
  LIMIT: "LIMIT_ORDER",
};


export class StockApiService {
  static async buyOrder(data: BuyOrderRequest): Promise<OrderResponse> {
    const response = await api.post<OrderResponse>(
      API_ROUTES.USER.STOCKS.ORDERS.BUY(data.symbol),
      data
    );
    return response.data;
  }

  static async sellOrder(data: SellOrderRequest): Promise<OrderResponse> {
    const response = await api.post<OrderResponse>(
      API_ROUTES.USER.STOCKS.ORDERS.SELL(data.symbol),
      data
    );
    return response.data;
  }

  static async limitBuyOrder(data: LimitBuyOrderRequest): Promise<OrderResponse> {
    const response = await api.post<OrderResponse>(
      API_ROUTES.USER.STOCKS.ORDERS.LIMIT_BUY(data.symbol),
      data
    );
    return response.data;
  }

  static async limitSellOrder(data: LimitSellOrderRequest): Promise<OrderResponse> {
    const response = await api.post<OrderResponse>(
      API_ROUTES.USER.STOCKS.ORDERS.LIMIT_SELL(data.symbol),
      data
    );
    return response.data;
  }

  static async getPendingOrders(symbol?: string): Promise<{ data: PendingOrder[] }> {
    const response = await api.get(API_ROUTES.USER.STOCKS.ORDERS.PENDING, {
      params: symbol ? { symbol } : {},
    });
    return response.data;
  }

  static async cancelLimitOrder(symbol: string, orderId: string): Promise<OrderResponse> {
    const response = await api.delete<OrderResponse>(
      API_ROUTES.USER.STOCKS.ORDERS.CANCEL(symbol, orderId)
    );
    return response.data;
  }
}
