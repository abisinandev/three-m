import { IStockRepository } from "@application/interfaces/repositories/stock/stock-repository.interface";
import { ContainerModule } from "inversify";
import { STOCK_TYPES } from "./stock.types";
import { StockRepository } from "@infrastructure/databases/repository/stock/stock.repository";
import { StockApiClient } from "@infrastructure/providers/stocks/stock-api-client";
import { IStockApiClient } from "@application/interfaces/repositories/stock/stocks-api.interface";
import { IStockWebsocketProvider } from "@application/interfaces/repositories/stock/stock-websocket.interface";
import { StockWebSocketClient } from "@infrastructure/providers/stocks/stock-websocket.client";
import { IMarketDataProvider } from "@application/interfaces/repositories/stock/market-data-provider.interface";
import { MarketDataProvider } from "@infrastructure/providers/stocks/market-data.provider";
import { IFetchStocks } from "@application/use_cases/stock/interfaces/fetch-stocks.interface";
import { FetchStocks } from "@application/use_cases/stock/fetch-stock.usecase";
import { UserStocksController } from "@presentation/http/controllers/stocks/user-stocks.controller";

export const StockModules = new ContainerModule(({ bind }) => {
    bind<IStockRepository>(STOCK_TYPES.StockRepository).to(StockRepository);
    bind<IStockApiClient>(STOCK_TYPES.StockApiClient).to(StockApiClient);

    bind<IStockWebsocketProvider>(STOCK_TYPES.StockWebSocketClient).to(StockWebSocketClient)
    bind<IMarketDataProvider>(STOCK_TYPES.MarketDataProvider).to(MarketDataProvider);
    bind<IFetchStocks>(STOCK_TYPES.FetchStocksUseCase).to(FetchStocks);
    bind<UserStocksController>(STOCK_TYPES.UserStocksController).to(UserStocksController);
})