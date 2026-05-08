import type { Stock } from "@/shared/components/interfaces/IStockTable";

export interface SparklineProps {
  data: number[];
  positive: boolean;
}

export interface StockTableProps {
  stocks: Stock[];
  isLoading: boolean;
  isError: boolean;
  watchlistSymbols: Set<string>;
  onToggleWatchlist: (symbol: string) => void;
  onNavigate: (symbol: string) => void;
}

export interface MarketMoverProps {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  isPositive: boolean;
  onNavigate: (symbol: string) => void;
}

export interface TradeActivity {
  symbol: string;
  type: string;
  quantity: number;
  totalPrice: number;
}

export interface RecentActivityProps {
  trades: TradeActivity[];
  onNavigate: (symbol: string) => void;
}

export interface DashboardTab {
  id: string;
  label: string;
}

export interface StockDashboardTabsProps {
  activeTab: string;
  setActiveTab: (tabId: string) => void;
  tabs: DashboardTab[];
}
