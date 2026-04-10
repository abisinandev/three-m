import { IStockRepository } from "@application/interfaces/repositories/stock/stock-repository.interface";
import { ContainerModule } from "inversify";
import { STOCK_TYPES } from "./stock.types";
import { StockRepository } from "@infrastructure/databases/repository/stock/stock.repository";
import { IStockWebsocketProvider } from "@application/interfaces/repositories/stock/stock-websocket.interface";
import { StockWebSocketClient } from "@infrastructure/providers/stocks/stock-websocket.client";
import { IFetchStocksUseCase } from "@application/use_cases/stock/interfaces/fetch-stocks.interface";
import { FetchStocksUseCase } from "@application/use_cases/stock/fetch-stock.usecase";
import { UserStocksController } from "@presentation/http/controllers/stocks/user-stocks.controller";
import { IStockDetailsUseCase } from "@application/use_cases/stock/interfaces/stock-details-usecase.interface";
import { StockDetailsUseCase } from "@application/use_cases/stock/stock-details.usecase";
import { IFetchStockCandlesUseCase } from "@application/use_cases/stock/interfaces/fetch-stock-candles.interface";
import { FetchStockCandlesUseCase } from "@application/use_cases/stock/fetch-stock-candles.usecase";

import { MarketDataService } from "@infrastructure/providers/stocks/market-data.service";
import { WsGateway } from "@presentation/express/websocket/ws.gateway";

import { CandleEngineService } from "@infrastructure/providers/stocks/market-data/services/candle-engine.service";
import { TimeframeAggregatorService } from "@infrastructure/providers/stocks/market-data/services/timeframe-aggregator.service";
import { PollingService } from "@infrastructure/providers/stocks/market-data/services/polling.service";
import { IYahooProvider } from "@application/interfaces/services/stocks/yahoo-provider.interface";
import { YahooProvider } from "@infrastructure/providers/stocks/market-data/providers/yahoo.provider";
import { OrdersController } from "@presentation/http/controllers/stocks/orders.controller";
import { MarketBuyOrderUseCase } from "@application/use_cases/stock/market-buy-order.usecase";
import { IMarketBuyOrderUseCase } from "@application/use_cases/stock/interfaces/buy-order-usecase.interface";
import { IMarketSellOrderUseCase } from "@application/use_cases/stock/interfaces/market-sell-order-usecase.interface";
import { MarketSellOrderUseCase } from "@application/use_cases/stock/market-sell-order.usecase";
import { IOrderRepository } from "@application/interfaces/repositories/stock/order-repository.interface";
import { OrderRepository } from "@infrastructure/databases/repository/stock/order.repository";
import { ITradeRepository } from "@application/interfaces/repositories/stock/trade-repository.interface";
import { TradeRepository } from "@infrastructure/databases/repository/stock/trade.repository";
import { AlgoTradingController } from "@presentation/http/controllers/algo-trading/algo-trading.controller";
import { GetStrategiesUseCase } from "@application/use_cases/algo-trading/get-strategies.usecase";
import { IAlgoStrategyRepository } from "@application/interfaces/repositories/algo/algo-strategy-repository.interface";
import { AlgoStrategyRepository } from "@infrastructure/databases/repository/algo/algo-strategy.repository";
import { ISaveAlgoStrategyUseCase } from "@application/use_cases/algo-trading/interfaces/save-algo-strategy.interface";
import { SaveAlgoStrategyUseCase } from "@application/use_cases/algo-trading/save-algo-strategy.usecase";
import { IGetActiveStrategyUseCase } from "@application/use_cases/algo-trading/interfaces/get-active-strategy.interface";
import { GetActiveStrategyUseCase } from "@application/use_cases/algo-trading/get-active-strategy.usecase";
import { IToggleAlgoStrategyUseCase } from "@application/use_cases/algo-trading/interfaces/toggle-algo-strategy.interface";
import { ToggleAlgoStrategyUseCase } from "@application/use_cases/algo-trading/toggle-algo-strategy.usecase";

export const StockModules = new ContainerModule(({ bind }) => {
    bind<IStockRepository>(STOCK_TYPES.StockRepository).to(StockRepository);

    bind<IStockWebsocketProvider>(STOCK_TYPES.StockWebSocketClient).to(StockWebSocketClient)
    bind<IFetchStocksUseCase>(STOCK_TYPES.FetchStocksUseCase).to(FetchStocksUseCase);
    bind<UserStocksController>(STOCK_TYPES.UserStocksController).to(UserStocksController);
    bind<IStockDetailsUseCase>(STOCK_TYPES.StockDetailsUseCase).to(StockDetailsUseCase);
    bind<IFetchStockCandlesUseCase>(STOCK_TYPES.FetchStockCandlesUseCase).to(FetchStockCandlesUseCase);

    bind<MarketDataService>(STOCK_TYPES.MarketDataService).to(MarketDataService);
    bind<WsGateway>(STOCK_TYPES.WsGateway).to(WsGateway);

    bind<IYahooProvider>(STOCK_TYPES.YahooProvider).to(YahooProvider);
    bind<PollingService>(STOCK_TYPES.PollingService).to(PollingService);

    bind<CandleEngineService>(STOCK_TYPES.CandleEngineService).to(CandleEngineService);
    bind<TimeframeAggregatorService>(STOCK_TYPES.TimeframeAggregatorService).to(TimeframeAggregatorService);

    bind<OrdersController>(STOCK_TYPES.OrdersController).to(OrdersController);
    bind<IMarketBuyOrderUseCase>(STOCK_TYPES.MarketBuyOrderUseCase).to(MarketBuyOrderUseCase);
    bind<IMarketSellOrderUseCase>(STOCK_TYPES.MarketSellOrderUseCase).to(MarketSellOrderUseCase);
    bind<IOrderRepository>(STOCK_TYPES.OrderRepository).to(OrderRepository);
    bind<ITradeRepository>(STOCK_TYPES.TradeRepository).to(TradeRepository);

    bind<AlgoTradingController>(STOCK_TYPES.AlgoTradingController).to(AlgoTradingController);
    bind<GetStrategiesUseCase>(STOCK_TYPES.GetStrategiesUseCase).to(GetStrategiesUseCase);
    bind<ISaveAlgoStrategyUseCase>(STOCK_TYPES.SaveAlgoStrategyUseCase).to(SaveAlgoStrategyUseCase);
    bind<IGetActiveStrategyUseCase>(STOCK_TYPES.GetActiveStrategyUseCase).to(GetActiveStrategyUseCase);
    bind<IToggleAlgoStrategyUseCase>(STOCK_TYPES.ToggleAlgoStrategyUseCase).to(ToggleAlgoStrategyUseCase);
    bind<IAlgoStrategyRepository>(STOCK_TYPES.AlgoStrategyRepository).to(AlgoStrategyRepository);
});
