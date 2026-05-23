import { inject, injectable } from "inversify";
import { MUTUAL_FUND_TYPES } from "@infrastructure/inversify_di/features/mutual-fund/mutual-fund.types";
import { PORTFOLIO_TYPES } from "@infrastructure/inversify_di/features/portfolio/portfolio.types";
import { STOCK_TYPES } from "@infrastructure/inversify_di/features/stock/stock.types";
import { IPortfolioRepository } from "@application/interfaces/repositories/feature/portfolio-repository.interface";
import { IPortfolioProjectionUseCase } from "./interfaces/portfolio-projection-usecase.interface";
import { IMutualFundNavUpdateProvider } from "@application/interfaces/services/externals/mutual-fund-nav-update-provider.interface";
import { IMarketDataProvider } from "@application/interfaces/repositories/stock/market-data-provider.interface";
import { PortfolioProjectionDTO, PortfolioProjectionResponseDTO } from "@application/dto/portfolio/portfolio-projection.dto";
import { ValidationError } from "@presentation/express/utils/error-handling";
import { AssetType } from "@domain/entities/portfolio/enum/asset-type";

@injectable()
export class PortfolioProjectionUseCase implements IPortfolioProjectionUseCase {

    constructor(
        @inject(PORTFOLIO_TYPES.PortfolioRepository) private readonly _portfolioRepository: IPortfolioRepository,
        @inject(MUTUAL_FUND_TYPES.NavUpdateProvider) private readonly _navUpdateProvider: IMutualFundNavUpdateProvider,
        @inject(STOCK_TYPES.MarketDataProvider) private readonly _marketDataProvider: IMarketDataProvider,
    ) { }

    async execute(data: PortfolioProjectionDTO, userId: string): Promise<PortfolioProjectionResponseDTO> {
        const { expectedReturnRate, years } = data;

        if (years < 1 || years > 30) {
            throw new ValidationError("Invalid projection period");
        }

        if (expectedReturnRate <= 0 || expectedReturnRate > 50) {
            throw new ValidationError("Invalid expected return rate");
        }

        const portfolioAssets = await this._portfolioRepository.findByUserId(userId) ?? [];
        if (!portfolioAssets.length) return {
            projectedValue: 0,
            projectedProfit: 0,
            futureTotalInvestment: 0,
            yearlyBreakdown: []
        };

        let totalInvestment = 0;
        let currentValue = 0;

        await Promise.all(
            portfolioAssets.map(async (asset) => {
                totalInvestment += asset.investedAmount;
                const qty = asset.assetType === AssetType.STOCK ? asset.quantity : asset.units;
                
                if (!qty || qty <= 0) return;

                if (asset.assetType === AssetType.STOCK) {
                    const quote = await this._marketDataProvider.getLatestQuote(asset.assetId); // Assuming assetId is the symbol
                    const price = quote?.price || asset.avgPrice;
                    currentValue += qty * price;
                } else if (asset.assetType === AssetType.MUTUAL_FUND) {
                    const navHistory = await this._navUpdateProvider.fetchNavHistories(asset.assetId); // Assuming assetId is schemeCode
                    const nav = navHistory?.length ? Number(navHistory[0].nav) : asset.avgPrice;
                    currentValue += qty * nav;
                }
            })
        );

        const monthlyRate = data.expectedReturnRate / 100 / 12;
        const totalMonths = years * 12;

        let futureValue = currentValue;

        const yearlyBreakdown: { year: number; value: number }[] = [];

        for (let month = 1; month <= totalMonths; month++) {
            futureValue *= (1 + monthlyRate);
            if (month % 12 === 0) {
                yearlyBreakdown.push({
                    year: month / 12,
                    value: Number(futureValue.toFixed(2))
                });
            }
        }

        const futureTotalInvestment = totalInvestment;
        const projectedProfit = futureValue - futureTotalInvestment;

        return {
            projectedValue: Number(futureValue.toFixed(2)),
            projectedProfit: Number(projectedProfit.toFixed(2)),
            futureTotalInvestment,
            yearlyBreakdown
        };
    }
}