import { MarketNews } from "../entities/MarketNews";

export interface IMarketNewsRepository {
    getMarketNews(): Promise<MarketNews[]>;
}
