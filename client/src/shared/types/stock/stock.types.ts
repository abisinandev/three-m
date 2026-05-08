export type OrderType = "MARKET_ORDER" | "LIMIT_ORDER";

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
  data?: unknown;
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
export interface StockInfo {
  logo?: string;
  symbol?: string;
  name?: string;
  exchange?: string;
}

export interface StockDetailHeaderProps {
  symbol: string;
  stockInfo: StockInfo;
  currentPrice: number;
  change: number;
  changePercent: number;
  isPositive: boolean;
  onTradeClick: (type: "buy" | "sell") => void;
}

export interface AlgoConsoleProps {
  symbol: string;
  onPremiumModalOpen: () => void;
}
