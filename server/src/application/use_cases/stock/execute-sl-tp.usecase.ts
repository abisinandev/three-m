import { inject, injectable } from "inversify";
import { STOCK_TYPES } from "@infrastructure/inversify_di/features/stock/stock.types";
import { PORTFOLIO_TYPES } from "@infrastructure/inversify_di/features/portfolio/portfolio.types";
import { IOrderRepository } from "@application/interfaces/repositories/stock/order-repository.interface";
import { IMarketDataProvider } from "@application/interfaces/repositories/stock/market-data-provider.interface";
import { IPortfolioRepository } from "@application/interfaces/repositories/feature/portfolio-repository.interface";
import { IMarketSellOrderUseCase } from "@application/use_cases/stock/interfaces/market-sell-order-usecase.interface";
import { IStockRepository } from "@application/interfaces/repositories/stock/stock-repository.interface";
import { OrderStatus } from "@domain/entities/stock/enum/order-status.enum";
import { OrderSide } from "@domain/entities/stock/enum/order-side.enum";
import { OrderType } from "@domain/entities/stock/enum/order-type.enum";
import { NotFoundError } from "@presentation/express/utils/error-handling";
import { ErrorMessages } from "@shared/constants/error.messages";
import { IExecuteSlTpUseCase } from "./interfaces/execute-sl-tp.interface";

@injectable()
export class ExecuteSlTpUseCase implements IExecuteSlTpUseCase {
    constructor(
        @inject(STOCK_TYPES.OrderRepository) private readonly _orderRepository: IOrderRepository,
        @inject(STOCK_TYPES.StockRepository) private readonly _stockRepository: IStockRepository,
        @inject(STOCK_TYPES.MarketDataProvider) private readonly _marketDataProvider: IMarketDataProvider,
        @inject(PORTFOLIO_TYPES.PortfolioRepository) private readonly _portfolioRepository: IPortfolioRepository,
        @inject(STOCK_TYPES.MarketSellOrderUseCase) private readonly _marketSellOrder: IMarketSellOrderUseCase,
    ) { }

    async execute(orderId: string): Promise<void> {
        const order = await this._orderRepository.findById(orderId);
        
        if (!order) return;
        if (order.status !== OrderStatus.FILLED) return;
        if (order.side !== OrderSide.BUY) return;
        
        const sl = order.stopLoss;
        const tp = order.takeProfit;

        if ((!sl || sl <= 0) && (!tp || tp <= 0)) return;

        const latestQuote = await this._marketDataProvider.getLatestQuote(order.symbol);
        const currentPrice = latestQuote?.price;
        if (!currentPrice) return;

        const isStopLossHit = sl && sl > 0 && currentPrice <= sl;
        const isTakeProfitHit = tp && tp > 0 && currentPrice >= tp;

        if (isStopLossHit || isTakeProfitHit) {

            const stock = await this._stockRepository.findBySymbol(order.symbol);
            if (!stock) throw new NotFoundError(ErrorMessages.STOCKS.NOT_FOUND);

            const portfolio = await this._portfolioRepository.findByUserIdAndSymbol(order.userId, stock.id as string);
            
            if (!portfolio || (portfolio.quantity ?? 0) < order.quantity) {
                await this.clearSlTp(orderId);
                return;
            }

            try {
                await this._marketSellOrder.execute({
                    symbol: order.symbol,
                    quantity: order.quantity,
                    orderType: OrderType.MARKET_ORDER,
                    isAlgoTrade: order.isAlgoTrade ?? false
                }, order.userId);

                await this.clearSlTp(orderId);
                
            } catch (error) {
                throw error;
            }
        }
    }

    private async clearSlTp(orderId: string): Promise<void> {
        const order = await this._orderRepository.findById(orderId);
        if (order) {

            order.stopLoss = null;
            order.takeProfit = null;
            await this._orderRepository.update(orderId, order);
        }
    }
}
