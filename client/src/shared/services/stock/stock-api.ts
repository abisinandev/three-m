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
  stopLoss?: number;
  takeProfit?: number;
}

export interface BuyOrderRequest extends TradeOrderRequest {}
export interface SellOrderRequest extends TradeOrderRequest {}

export interface LimitBuyOrderRequest {
  symbol: string;
  quantity: number;
  orderType: "LIMIT_ORDER";
  price: number;
  limitPrice?: number;
  stopLoss?: number;
  takeProfit?: number;
}

export interface LimitSellOrderRequest {
  symbol: string;
  quantity: number;
  orderType: "LIMIT_ORDER";
  price: number;
  limitPrice?: number;
  stopLoss?: number;
  takeProfit?: number;
}

export interface OrderResponse {
  success: boolean;
  message: string;
  data?: any;
}

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

export interface PendingOrder {
  id: string;
  symbol: string;
  side: "BUY" | "SELL";
  orderType: "LIMIT_ORDER";
  quantity: number;
  price: number;
  limitPrice?: number | null;
  stopLoss?: number | null;
  takeProfit?: number | null;

  status: "PENDING";
  createdAt: string;
}

