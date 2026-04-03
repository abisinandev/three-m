import { MarketNews } from "../../../dto/market-news/MarketNews";

export interface IMarketNewsRepository {
    getMarketNews(): Promise<MarketNews[]>;
}
