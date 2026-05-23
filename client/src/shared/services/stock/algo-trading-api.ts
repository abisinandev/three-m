import api from "@/lib/axios-user";
import { API_ROUTES } from "@shared/constants/apiRoutes";

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
  data?: unknown;
}

export class AlgoTradingApiService {
  static async confirmSignal(data: ConfirmSignalRequest): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>(
      API_ROUTES.USER.ALGO_TRADING.CONFIRM_SIGNAL,
      { ...data, orderType: data.orderType ?? "MARKET_ORDER" }
    );
    return response.data;
  }
}
