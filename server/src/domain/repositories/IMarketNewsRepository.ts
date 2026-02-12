import { MarketNews } from "../../application/dto/market-news/MarketNews";

export interface IMarketNewsRepository {
    getMarketNews(): Promise<MarketNews[]>;
}
