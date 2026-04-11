import { MovingAverageStrategy } from "./strategies/moving-average-strategy";
import { RSIStrategy } from "./strategies/rsi-strategy";

export const StrategyRegistry = {
  MA: new MovingAverageStrategy(),
  RSI: new RSIStrategy()
};