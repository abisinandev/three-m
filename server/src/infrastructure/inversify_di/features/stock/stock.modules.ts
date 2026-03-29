import { IStockRepository } from "@application/interfaces/repositories/stock/stock-repository.interface";
import { ContainerModule } from "inversify";
import { STOCK_TYPES } from "./stock.types";
import { StockRepository } from "@infrastructure/databases/repository/stock/stock.repository";
import { IStockWebsocketProvider } from "@application/interfaces/repositories/stock/stock-websocket.interface";
import { StockWebSocketClient } from "@infrastructure/providers/stocks/stock-websocket.client";
import { IMarketDataProvider } from "@application/interfaces/repositories/stock/market-data-provider.interface";
import { MarketDataProvider } from "@infrastructure/providers/stocks/market-data.provider";
import { IFetchStocksUseCase } from "@application/use_cases/stock/interfaces/fetch-stocks.interface";
import { FetchStocksUseCase } from "@application/use_cases/stock/fetch-stock.usecase";
import { UserStocksController } from "@presentation/http/controllers/stocks/user-stocks.controller";
import { IStockDetailsUseCase } from "@application/use_cases/stock/interfaces/stock-details-usecase.interface";
import { StockDetailsUseCase } from "@application/use_cases/stock/stock-details.usecase";
import { IFinnhubService } from "@application/interfaces/services/stocks/finnhub-service.interface";
import { FinnhubService } from "@infrastructure/providers/stocks/finnhub.service";
import { IFetchStockCandlesUseCase } from "@application/use_cases/stock/interfaces/fetch-stock-candles.interface";
import { FetchStockCandlesUseCase } from "@application/use_cases/stock/fetch-stock-candles.usecase";

export const StockModules = new ContainerModule(({ bind }) => {
    bind<IStockRepository>(STOCK_TYPES.StockRepository).to(StockRepository);

    bind<IStockWebsocketProvider>(STOCK_TYPES.StockWebSocketClient).to(StockWebSocketClient)
    bind<IMarketDataProvider>(STOCK_TYPES.MarketDataProvider).to(MarketDataProvider);
    bind<IFetchStocksUseCase>(STOCK_TYPES.FetchStocksUseCase).to(FetchStocksUseCase);
    bind<UserStocksController>(STOCK_TYPES.UserStocksController).to(UserStocksController);
    bind<IStockDetailsUseCase>(STOCK_TYPES.StockDetailsUseCase).to(StockDetailsUseCase);
    bind<IFetchStockCandlesUseCase>(STOCK_TYPES.FetchStockCandlesUseCase).to(FetchStockCandlesUseCase);

    bind<IFinnhubService>(STOCK_TYPES.FinnhubService).to(FinnhubService);
})