import { inject, injectable } from "inversify";
import { IFetchPortfolioHistoryUseCase, PortfolioHistoryDTO } from "./interfaces/fetch-portfolio-history-usecase.interface";
import { STOCK_TYPES } from "@infrastructure/inversify_di/features/stock/stock.types";
import { ITradeRepository } from "@application/interfaces/repositories/stock/trade-repository.interface";
import { QueryOptions } from "mongoose";
import { MUTUAL_FUND_TYPES } from "@infrastructure/inversify_di/features/mutual-fund/mutual-fund.types";
import { IInvestmentRepository } from "@application/interfaces/repositories/feature/investment-repository.interface";
import { IMutualFundRepository } from "@application/interfaces/repositories/feature/mutual-fund-repository.interface";
import { IStockRepository } from "@application/interfaces/repositories/stock/stock-repository.interface";

@injectable()
export class FetchPortfolioHistoryUseCase implements IFetchPortfolioHistoryUseCase {
    constructor(
        @inject(STOCK_TYPES.TradeRepository) private readonly _tradeRepository: ITradeRepository,
        @inject(MUTUAL_FUND_TYPES.InvestmentRepository) private readonly _investmentRepository: IInvestmentRepository,
        @inject(MUTUAL_FUND_TYPES.MutualFundRepository) private readonly _mutualFundRepository: IMutualFundRepository,
        @inject(STOCK_TYPES.StockRepository) private readonly _stockRepository: IStockRepository,
    ) { }

    async execute(userId: string, options: QueryOptions): Promise<{
        data: PortfolioHistoryDTO[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }> {
        const { page = 1, limit = 10, search = "" } = options;

        // Increase limit slightly to ensure we have enough data to merge and sort
        // In a real production app, you might use a more complex pagination strategy
        const fetchOptions = { ...options, limit: Number(limit) * Number(page) };

        const [trades, totalTrades, investments, totalInvestments] = await Promise.all([
            this._tradeRepository.findWithFilters(userId, fetchOptions),
            this._tradeRepository.countWithFilters(userId, {}, search as string),
            this._investmentRepository.getUserInvestments(userId, fetchOptions),
            this._investmentRepository.countInvestments(userId, fetchOptions)
        ]);

        const history: PortfolioHistoryDTO[] = [];

        // Map Stock Trades
        for (const trade of trades) {
            // Check if search matches symbol
            if (search && !trade.symbol.toLowerCase().includes(search.toLowerCase())) continue;

            const stock = await this._stockRepository.findBySymbol(trade.symbol);
            history.push({
                id: trade.id as string,
                userId: trade.userId,
                assetId: trade.symbol,
                assetName: stock?.name || trade.symbol,
                assetType: "STOCK",
                side: trade.side as any,
                quantity: trade.quantity,
                price: trade.price,
                totalAmount: trade.quantity * trade.price,
                status: "COMPLETED",
                date: trade.createdAt
            });
        }

        // Map MF Investments
        for (const inv of investments) {
            // Check if search matches schemeCode or schemeName
            const matchesSearch = !search || 
                inv.schemeCode.toLowerCase().includes(search.toLowerCase()) || 
                inv.fund?.schemeName.toLowerCase().includes(search.toLowerCase());
            
            if (!matchesSearch) continue;

            history.push({
                id: inv.id,
                userId: userId,
                assetId: inv.schemeCode,
                assetName: inv.fund?.schemeName || inv.schemeCode,
                assetType: "MF",
                side: inv.status === "REDEEMED" ? "REDEEMED" : "INVESTED",
                quantity: inv.units || 0,
                price: inv.nav || 0,
                totalAmount: inv.amount,
                status: inv.status,
                date: inv.createdAt as Date
            });
        }

        // Sort by date descending
        history.sort((a, b) => b.date.getTime() - a.date.getTime());

        // Paginate the combined list
        const startIndex = (Number(page) - 1) * Number(limit);
        const paginatedData = history.slice(startIndex, startIndex + Number(limit));

        const total = totalTrades + totalInvestments;

        return {
            data: paginatedData,
            total,
            page: Number(page),
            limit: Number(limit),
            totalPages: Math.ceil(total / (Number(limit) || 10)),
        };
    }
}
