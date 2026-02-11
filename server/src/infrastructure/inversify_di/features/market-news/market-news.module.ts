import { ContainerModule } from "inversify";
import { MARKET_NEWS_TYPES } from "./market-news.types";
import { MarketNewsControllers } from "@presentation/http/controllers/market-news/market-news.controller";
import { NewsApiProvider } from "@infrastructure/providers/market-news/news-api.provider";
import { MarketNewsServices } from "@infrastructure/providers/market-news/market-news.service";
import { IGetMarketNewsUseCase } from "@application/use_cases/market-news/interfaces/get-market-news-usecase.interfac";
import { GetMarketNewsUseCase } from "@application/use_cases/market-news/get-market-news.usecase";
import { IMarketNewsServices } from '@application/interfaces/services/market-news/market-news.service.interface'
import { INewsApiProvider } from "@application/interfaces/services/market-news/news-api-provider.interface";

export const MarketNewsModules = new ContainerModule(({ bind }) => {
    bind<MarketNewsControllers>(MARKET_NEWS_TYPES.MarketNewsControllers).to(MarketNewsControllers);

    bind<INewsApiProvider>(MARKET_NEWS_TYPES.NewsApiProvider).to(NewsApiProvider);

    bind<IMarketNewsServices>(MARKET_NEWS_TYPES.MarketNewsServices).to(MarketNewsServices);

    bind<IGetMarketNewsUseCase>(MARKET_NEWS_TYPES.GetMarketNewsUseCase).to(GetMarketNewsUseCase)
})