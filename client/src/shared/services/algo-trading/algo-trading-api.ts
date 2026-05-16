import api from "@/lib/axios-user";

export interface StrategyMetadata {
  name: string;
  displayName: string;
  configSchema: {
    key: string;
    type: string;
    default: number | string;
  }[];
}

export const getAlgoStrategies = async (): Promise<StrategyMetadata[]> => {
  const response = await api.get('/user/stock/algo-trading/strategies');
  return response.data?.data || [];
};

export const saveAlgoStrategy = async (data: { symbol: string, strategyName: string, config: Record<string, unknown> }): Promise<unknown> => {
  const response = await api.post('/user/stock/algo-trading/strategy', data);
  return response.data;
};

export interface ActiveStrategyResponse {
  _id: string;
  strategyName: string;
  symbol: string;
  isActive: boolean;
}

export const getActiveStrategyBySymbol = async (symbol: string): Promise<ActiveStrategyResponse | null> => {
  const response = await api.get(`/user/stock/algo-trading/active/${symbol}`);
  return response.data?.data ?? null;
};

export const toggleAlgoStrategyStatus = async (strategyId: string, isActive: boolean): Promise<unknown> => {
  const response = await api.post(`/user/stock/algo-trading/toggle-status/${strategyId}`, { isActive });
  return response.data;
};
