import { inject, injectable } from "inversify";
import { IFetchPortfolioAssetsUsecase } from "./interfaces/fetch-portfolio-assets.usecase.interface";
import { PortfolioAssetQueryDTO } from "@application/dto/portfolio/portfolio-asset-query.dto";
import { PortfolioAssetsResponseDTO, PortfolioAssetDTO } from "@application/dto/portfolio/portfolio-asset-response.dto";
import { MUTUAL_FUND_TYPES } from "@infrastructure/inversify_di/features/mutual-fund/mutual-fund.types";
import { PORTFOLIO_TYPES } from "@infrastructure/inversify_di/features/portfolio/portfolio.types";
import { STOCK_TYPES } from "@infrastructure/inversify_di/features/stock/stock.types";
import { IInvestmentRepository } from "@application/interfaces/repositories/feature/investment-repository.interface";
import { IPortfolioRepository } from "@application/interfaces/repositories/feature/portfolio-repository.interface";
import { IMutualFundNavUpdateProvider } from "@application/interfaces/services/externals/mutual-fund-nav-update-provider.interface";
import { IMarketDataProvider } from "@application/interfaces/repositories/stock/market-data-provider.interface";
import { AssetType } from "@domain/entities/portfolio/enum/asset-type";
import { IMutualFundRepository } from "@application/interfaces/repositories/feature/mutual-fund-repository.interface";
import { IStockRepository } from "@application/interfaces/repositories/stock/stock-repository.interface";

@injectable()
export class FetchPortfolioAssetsUseCases implements IFetchPortfolioAssetsUsecase {
    constructor(
        @inject(MUTUAL_FUND_TYPES.InvestmentRepository) private readonly _investmentRepository: IInvestmentRepository,
        @inject(PORTFOLIO_TYPES.PortfolioRepository) private readonly _portfolioRepository: IPortfolioRepository,
        @inject(MUTUAL_FUND_TYPES.NavUpdateProvider) private readonly _navUpdateProvider: IMutualFundNavUpdateProvider,
        @inject(STOCK_TYPES.MarketDataProvider) private readonly _marketDataProvider: IMarketDataProvider,
        @inject(MUTUAL_FUND_TYPES.MutualFundRepository) private readonly _mutualFundRepository: IMutualFundRepository,
        @inject(STOCK_TYPES.StockRepository) private readonly _stockRepository: IStockRepository,
    ) { }

    async execute(userId: string, query: PortfolioAssetQueryDTO): Promise<PortfolioAssetsResponseDTO> {
        const { page = 1, limit = 10, search = "" } = query;

        const [userAssets, groupedInvestments] = await Promise.all([
            this._portfolioRepository.getUserAssets(userId),
            this._investmentRepository.findGroupedInvestmentsByUser(userId)
        ]);
 
        const assetProcessingPromises = userAssets.map(async (asset): Promise<PortfolioAssetDTO | null> => {

            if (asset.assetType === AssetType.MUTUAL_FUND) {
                 
                const fund = await this._mutualFundRepository.findById(asset.assetId);
                if (!fund) return null;

                if (search && !fund.schemeCode.toLowerCase().includes(search.toLowerCase()) &&
                    !fund.schemeName?.toLowerCase().includes(search.toLowerCase())) {
                    return null;
                }

                const latestNav = await this._navUpdateProvider.fetchNavHistories(fund.schemeCode);
                const currentNav = latestNav?.[0]?.nav || 0;

                const fundGroup = groupedInvestments?.find(g => g.schemeCode === fund.schemeCode);
                const investmentList = fundGroup?.investments;
                
                if (!investmentList || investmentList.length === 0) return null;

                const holdingUnits = asset.units ?? 0;
                const currentValue = holdingUnits * currentNav;
                const investedAmount = asset.investedAmount;
                const profit = currentValue - investedAmount;

                return {
                    id: asset.id as string,
                    userId: asset.userId,
                    assetId: asset.assetId,
                    symbol: fund.schemeCode,
                    name: fund.schemeName || fund.schemeCode,
                    schemeCode: fund.schemeCode,
                    schemeName: fund.schemeName || fund.schemeCode,
                    assetType: "MF",
                    quantity: holdingUnits,
                    avgPrice: asset.avgPrice || 0,
                    investedAmount,
                    currentPrice: currentNav,
                    currentValue,
                    profit,
                    profitPercentage: investedAmount > 0 ? (profit / investedAmount) * 100 : 0,
                    status: investmentList[0].status,
                    logo: fund.logo || "",
                    category: fund.category || "",
                    nav: currentNav,
                    navDate: latestNav?.[0]?.navDate || investmentList[0].navDate,
                    units: holdingUnits,
                    createdAt: asset.createdAt,
                    updatedAt: asset.updatedAt,
                };
            } else {
                const stock = await this._stockRepository.findById(asset.assetId);
                if (!stock) return null;

                if (search && !stock.symbol.toLowerCase().includes(search.toLowerCase()) &&
                    !stock.name.toLowerCase().includes(search.toLowerCase())) {
                    return null;
                }

                let currentPrice = asset.avgPrice;
                const quote = await this._marketDataProvider.getLatestQuote(stock.symbol);
                if (quote) currentPrice = quote.price;

                const currentValue = (asset.quantity || 0) * currentPrice;
                const profit = currentValue - asset.investedAmount;

                return {
                    id: asset.id as string,
                    userId: asset.userId,
                    assetId: asset.assetId,
                    symbol: stock.symbol,
                    name: stock.name,
                    assetType: "STOCK",
                    quantity: asset.quantity || 0,
                    avgPrice: asset.avgPrice,
                    investedAmount: asset.investedAmount,
                    currentPrice,
                    currentValue,
                    profit,
                    profitPercentage: asset.investedAmount > 0 ? (profit / asset.investedAmount) * 100 : 0,
                    status: "HOLDING",
                    logo: stock.logo || "",
                    createdAt: asset.createdAt,
                    updatedAt: asset.updatedAt,
                };
            }
        });

        const allResults = (await Promise.all(assetProcessingPromises)).filter(a => a !== null) as PortfolioAssetDTO[];
 
        const totalCount = allResults.length;
        const startIndex = (Number(page) - 1) * Number(limit);
        const paginatedData = allResults.slice(startIndex, startIndex + Number(limit));

        return { 
            data: paginatedData,
            total: totalCount,
            page: Number(page),
            limit: Number(limit),
            totalPages: Math.ceil(totalCount / Number(limit)),
        };
    }
}
