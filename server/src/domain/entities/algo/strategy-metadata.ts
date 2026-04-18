export interface StrategyMetadata {
  name: string;
  displayName: string;
  configSchema: {
    key: string;
    type: string;
    default: number | string;
  }[];
}
