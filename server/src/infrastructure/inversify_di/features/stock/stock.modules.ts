import { IStockRepository } from "@application/interfaces/repositories/stock/stock-repository.interface";
import { ContainerModule } from "inversify";
import { STOCK_TYPES } from "./stock.types";
import { StockRepository } from "@infrastructure/databases/repository/stock/stock.repository";
import { StockApiClient } from "@infrastructure/providers/stocks/stock-api-client";
import { IStockApiClient } from "@application/interfaces/repositories/stock/stocks-api.interface";
import { ISyncStockUseCase } from "@application/use_cases/stock/interfaces/sync-stock-usecase.interface";
import { SyncStocksUseCase } from "@application/use_cases/stock/sync-stock.usecase";
import { IStockWebsocketProvider } from "@application/interfaces/repositories/stock/stock-websocket.interface";
import { StockWebSocketClient } from "@infrastructure/providers/stocks/stock-websocket.client";

export const StockModules = new ContainerModule(({ bind }) => {
    bind<IStockRepository>(STOCK_TYPES.StockRepository).to(StockRepository);
    bind<IStockApiClient>(STOCK_TYPES.StockApiClient).to(StockApiClient);
    bind<ISyncStockUseCase>(STOCK_TYPES.SyncStocksUseCase).to(SyncStocksUseCase);

    bind<IStockWebsocketProvider>(STOCK_TYPES.StockWebSocketClient).to(StockWebSocketClient)
})