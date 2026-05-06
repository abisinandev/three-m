import api from "@lib/axiosUser";

export type SignalAction = "BUY" | "SELL";
export type OrderType = "MARKET_ORDER" | "LIMIT_ORDER";

export interface ConfirmSignalRequest {
  notificationId: string;
  signalId: string;
  symbol: string;
  action: SignalAction;
  quantity: number;
  stopLoss?: number;
  takeProfit?: number;
  orderType?: OrderType;
}

export interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
}

export class AlgoTradingApiService {
  static async confirmSignal(data: ConfirmSignalRequest): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>(
      `/user/stock/algo-trading/confirm-signal`,
      { ...data, orderType: data.orderType ?? "MARKET_ORDER" }
    );
    return response.data;
  }
}
