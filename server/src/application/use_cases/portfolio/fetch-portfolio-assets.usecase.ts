import { inject, injectable } from "inversify";
import { IFetchPortfolioAssetsUsecase } from "./interfaces/fetch-portfolio-assets.usecase.interface";
import { PortfolioAssetQueryDTO } from "@application/dto/portfolio/portfolio-asset-query.dto";
import { PaginatedPortfolioAssetsResponseDTO, PortfolioAssetResponseDTO } from "@application/dto/portfolio/portfolio-asset-response.dto";
import { MUTUAL_FUND_TYPES } from "@infrastructure/inversify_di/features/mutual-fund/mutual-fund.types";
import { PORTFOLIO_TYPES } from "@infrastructure/inversify_di/features/portfolio/portfolio.types";
import { STOCK_TYPES } from "@infrastructure/inversify_di/features/stock/stock.types";
import { IInvestmentRepository } from "@application/interfaces/repositories/feature/investment-repository.interface";
import { IPortfolioRepository } from "@application/interfaces/repositories/feature/portfolio-repository.interface";
import { IStockRepository } from "@application/interfaces/repositories/stock/stock-repository.interface";
import { IMutualFundNavUpdateProvider } from "@application/interfaces/services/externals/mutual-fund-nav-update-provider.interface";
import { IMarketDataProvider } from "@application/interfaces/repositories/stock/market-data-provider.interface";
import { InvestmentStatus } from "@domain/enum/funds/investment.enums";
import { AssetType } from "@domain/entities/portfolio/enum/asset-type";

@injectable()
export class FetchPortfolioAssetsUseCases implements IFetchPortfolioAssetsUsecase {
    constructor(
        @inject(MUTUAL_FUND_TYPES.InvestmentRepository) private readonly _investmentRepository: IInvestmentRepository,
        @inject(PORTFOLIO_TYPES.PortfolioRepository) private readonly _portfolioRepository: IPortfolioRepository,
        @inject(STOCK_TYPES.StockRepository) private readonly _stockRepository: IStockRepository,
        @inject(MUTUAL_FUND_TYPES.NavUpdateProvider) private readonly _navUpdateProvider: IMutualFundNavUpdateProvider,
        @inject(STOCK_TYPES.MarketDataProvider) private readonly _marketDataProvider: IMarketDataProvider,
    ) { }

    async execute(userId: string, query: PortfolioAssetQueryDTO): Promise<PaginatedPortfolioAssetsResponseDTO> {
        const { assetType = "ALL", page = 1, limit = 10, search = "" } = query;

        let assets: PortfolioAssetResponseDTO[] = [];
        let totalCount = 0;

        if (assetType === "MF" || assetType === "ALL") {
            const [investments, mfTotal] = await Promise.all([
                this._investmentRepository.getUserInvestments(userId, { ...query, filter: { status: InvestmentStatus.ALLOTTED } }),
                this._investmentRepository.countInvestments(userId, { ...query, filter: { status: InvestmentStatus.ALLOTTED } })
            ]);

            const mfAssets = await Promise.all(investments.map(async (inv) => {
                const latestNav = await this._navUpdateProvider.fetchNavHistories(inv.schemeCode);
                const currentPrice = latestNav?.[0]?.nav || inv.nav || 0;
                const currentValue = (inv.units || 0) * currentPrice;
                const profit = currentValue - inv.amount;

                return {
                    id: inv.id,
                    userId: inv.userId,
                    assetId: inv.schemeCode,
                    symbol: inv.schemeCode,
                    schemeCode: inv.schemeCode,
                    name: inv.fund?.schemeName || inv.schemeCode,
                    schemeName: inv.fund?.schemeName || inv.schemeCode,
                    assetType: "MF" as const,
                    quantity: inv.units || 0,
                    avgPrice: inv.nav || 0,
                    investedAmount: inv.amount,
                    currentPrice,
                    currentValue,
                    profit,
                    profitPercentage: inv.amount > 0 ? (profit / inv.amount) * 100 : 0,
                    status: inv.status,
                    logo: inv.fund?.logo || "",
                    category: inv.fund?.category || "",
                    createdAt: inv.createdAt,
                    updatedAt: inv.updatedAt
                };
            }));

            assets.push(...mfAssets);
            totalCount += mfTotal;
        }

        if (assetType === "STOCK" || assetType === "ALL") {
            const stockFilter = { assetType: AssetType.STOCK };
            const [portfolios, stockTotal] = await Promise.all([
                this._portfolioRepository.findWithFilters(userId, { ...query, filter: stockFilter }),
                this._portfolioRepository.countWithFilters(userId, stockFilter, search)
            ]);

            const stockAssets = await Promise.all(portfolios.map(async (pf) => {
                let currentPrice = pf.avgPrice;
                const quote = await this._marketDataProvider.getLatestQuote(pf.stockDetails?.symbol || pf.assetId);
                if (quote) currentPrice = quote.price;

                const currentValue = (pf.quantity || 0) * currentPrice;
                const profit = currentValue - pf.investedAmount;

                return {
                    id: pf.id,
                    userId: pf.userId,
                    assetId: pf.assetId,
                    symbol: pf.stockDetails?.symbol || pf.assetId,
                    schemeCode: pf.stockDetails?.symbol || pf.assetId,
                    name: pf.stockDetails?.name || pf.assetId,
                    schemeName: pf.stockDetails?.name || pf.assetId,
                    assetType: "STOCK" as const,
                    quantity: pf.quantity || 0,
                    avgPrice: pf.avgPrice,
                    investedAmount: pf.investedAmount,
                    currentPrice,
                    currentValue,
                    profit,
                    profitPercentage: pf.investedAmount > 0 ? (profit / pf.investedAmount) * 100 : 0,
                    status: "HOLDING",
                    logo: pf.stockDetails?.logo || "",
                    createdAt: pf.createdAt,
                    updatedAt: pf.updatedAt
                };
            }));

            assets.push(...stockAssets);
            totalCount += stockTotal;
        }

        console.log(assets)

        return {
            data: assets,
            total: totalCount,
            page: Number(page),
            limit: Number(limit),
            totalPages: Math.ceil(totalCount / Number(limit)),
        };
    }
}