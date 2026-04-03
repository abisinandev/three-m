import api from "@lib/axiosUser";

export type OrderType = "MARKET_ORDER" | "LIMIT_ORDER";

export const ORDER_TYPES: Record<string, OrderType> = {
  MARKET: "MARKET_ORDER",
  LIMIT: "LIMIT_ORDER",
};

export interface TradeOrderRequest {
  symbol: string;
  quantity: number;
  orderType: OrderType;
  price?: number;
}

export interface BuyOrderRequest extends TradeOrderRequest {
  stopLoss?: number;
  takeProfit?: number;
}

export interface SellOrderRequest extends TradeOrderRequest {}

export interface OrderResponse {
  success: boolean;
  message: string;
  data?: any;
}

export class StockApiService {
  /**
   * Executes a buy order for a specific stock
   */
  static async buyOrder(data: BuyOrderRequest): Promise<OrderResponse> {
    const response = await api.post<OrderResponse>(
      `/user/stock/order/${data.symbol}/buy`,
      data
    );
    return response.data;
  }

  /**
   * Executes a sell order for a specific stock
   */
  static async sellOrder(data: SellOrderRequest): Promise<OrderResponse> {
    const response = await api.post<OrderResponse>(
      `/user/stock/order/${data.symbol}/sell`,
      data
    );
    return response.data;
  }
}
