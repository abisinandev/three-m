import api from "@lib/axiosUser";
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
      `/user/stock/order/${data.symbol}/buy`,
      data
    );
    return response.data;
  }

  static async sellOrder(data: SellOrderRequest): Promise<OrderResponse> {
    const response = await api.post<OrderResponse>(
      `/user/stock/order/${data.symbol}/sell`,
      data
    );
    return response.data;
  }

  static async limitBuyOrder(data: LimitBuyOrderRequest): Promise<OrderResponse> {
    const response = await api.post<OrderResponse>(
      `/user/stock/order/${data.symbol}/limit-buy`,
      data
    );
    return response.data;
  }

  static async limitSellOrder(data: LimitSellOrderRequest): Promise<OrderResponse> {
    const response = await api.post<OrderResponse>(
      `/user/stock/order/${data.symbol}/limit-sell`,
      data
    );
    return response.data;
  }

  static async getPendingOrders(symbol?: string): Promise<{ data: PendingOrder[] }> {
    const response = await api.get(`/user/stock/order/pending`, {
      params: symbol ? { symbol } : {},
    });
    return response.data;
  }

  static async cancelLimitOrder(symbol: string, orderId: string): Promise<OrderResponse> {
    const response = await api.delete<OrderResponse>(
      `/user/stock/order/${symbol}/cancel/${orderId}`
    );
    return response.data;
  }
}



