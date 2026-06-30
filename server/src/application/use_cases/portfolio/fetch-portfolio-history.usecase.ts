import { inject, injectable } from "inversify";
import { IFetchPortfolioHistoryUseCase, PortfolioHistoryDTO } from "./interfaces/fetch-portfolio-history-usecase.interface";
import { STOCK_TYPES } from "@infrastructure/inversify_di/features/stock/stock.types";
import { ITradeRepository } from "@application/interfaces/repositories/stock/trade-repository.interface";
import { QueryOptions } from "mongoose";
import { MUTUAL_FUND_TYPES } from "@infrastructure/inversify_di/features/mutual-fund/mutual-fund.types";
import { IInvestmentRepository } from "@application/interfaces/repositories/feature/investment-repository.interface";
import { IStockRepository } from "@application/interfaces/repositories/stock/stock-repository.interface";
import { InvestmentStatus } from "@domain/enum/funds/investment.enums";

@injectable()
export class FetchPortfolioHistoryUseCase implements IFetchPortfolioHistoryUseCase {
    constructor(
        @inject(STOCK_TYPES.TradeRepository) private readonly _tradeRepository: ITradeRepository,
        @inject(MUTUAL_FUND_TYPES.InvestmentRepository) private readonly _investmentRepository: IInvestmentRepository,
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

        const fetchOptions = { ...options, page: 1, limit: Number(limit) * Number(page) };
        const mfOptions = { ...fetchOptions, filter: { status: { $ne: InvestmentStatus.INITIATED } } };

        const [trades, totalTrades, investments, totalInvestments] = await Promise.all([
            this._tradeRepository.findWithFilters(userId, fetchOptions),
            this._tradeRepository.countWithFilters(userId, {}, search as string),
            this._investmentRepository.getUserInvestments(userId, mfOptions),
            this._investmentRepository.countInvestments(userId, mfOptions)
        ]);

        const history: PortfolioHistoryDTO[] = [];

        for (const trade of trades) {

            if (search && !trade.symbol.toLowerCase().includes(search.toLowerCase())) continue;

            const stock = await this._stockRepository.findBySymbol(trade.symbol);
            history.push({
                assetName: stock?.name || trade.symbol,
                assetType: "STOCK",
                side: trade.side,
                quantity: trade.quantity,
                price: trade.price,
                totalAmount: trade.quantity * trade.price,
                status: "COMPLETED",
                date: trade.createdAt
            });
        }

        for (const inv of investments) {
 
            const matchesSearch = !search || 
                inv.schemeCode.toLowerCase().includes(search.toLowerCase()) || 
                inv.fund?.schemeName.toLowerCase().includes(search.toLowerCase());
            
            if (!matchesSearch) continue;
            if (inv.status === InvestmentStatus.INITIATED) continue;

            history.push({
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

        history.sort((a, b) => b.date.getTime() - a.date.getTime());

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
