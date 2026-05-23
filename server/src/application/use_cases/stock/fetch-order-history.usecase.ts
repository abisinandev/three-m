import { inject, injectable } from "inversify";
import { IFetchOrderHistoryUseCase, OrderHistoryItemDTO } from "./interfaces/fetch-order-history.interface";
import { STOCK_TYPES } from "@infrastructure/inversify_di/features/stock/stock.types";
import { IOrderRepository } from "@application/interfaces/repositories/stock/order-repository.interface";
import { IStockRepository } from "@application/interfaces/repositories/stock/stock-repository.interface";

@injectable()
export class FetchOrderHistoryUseCase implements IFetchOrderHistoryUseCase {
    constructor(
        @inject(STOCK_TYPES.OrderRepository) private readonly _orderRepository: IOrderRepository,
        @inject(STOCK_TYPES.StockRepository) private readonly _stockRepository: IStockRepository,
    ) { }

    async execute(userId: string, page: number, limit: number): Promise<{ orders: OrderHistoryItemDTO[]; total: number }> {
        const { orders, total } = await this._orderRepository.findUserAllOrders(userId, page, limit);

        const symbols = Array.from(new Set(orders.map(o => o.symbol)));
        
        const stockDetailsList = await Promise.all(
            symbols.map(sym => this._stockRepository.findBySymbol(sym))
        );

        const stockMap = new Map<string, { name: string; logo?: string; exchange: string }>();
        for (const s of stockDetailsList) {
            if (s) {
                stockMap.set(s.symbol, {
                    name: s.name,
                    logo: s.logo || undefined,
                    exchange: s.exchange,
                });
            }
        }

        const mappedOrders: OrderHistoryItemDTO[] = orders.map(o => {
            const stockInfo = stockMap.get(o.symbol) || { name: o.symbol, logo: undefined, exchange: "NSE" };
            return {
                id: o.id || "",
                userId: o.userId,
                symbol: o.symbol,
                name: stockInfo.name,
                logo: stockInfo.logo,
                exchange: stockInfo.exchange,
                side: o.side,
                orderType: o.orderType,
                quantity: o.quantity,
                price: o.price,
                limitPrice: o.limitPrice,
                stopLoss: o.stopLoss,
                takeProfit: o.takeProfit,
                status: o.status,
                filledQty: o.filledQty,
                executedPrice: o.executedPrice,
                createdAt: o.createdAt,
                updatedAt: o.updatedAt,
                executedAt: o.executedAt,
                isAlgoTrade: o.isAlgoTrade,
            };
        });

        return { orders: mappedOrders, total };
    }
}
