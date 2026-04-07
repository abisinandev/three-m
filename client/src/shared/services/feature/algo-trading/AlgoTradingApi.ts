import api from "@lib/axiosUser";

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
