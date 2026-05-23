import { IMutualFundNavRepository } from "@application/interfaces/repositories/feature/mutual-fund-nav-repository.interface";
import { IMutualFundRepository } from "@application/interfaces/repositories/feature/mutual-fund-repository.interface";
import { IMarketDataProvider } from "@application/interfaces/repositories/stock/market-data-provider.interface";
import { IStockRepository } from "@application/interfaces/repositories/stock/stock-repository.interface";
import { ICacheProvider } from "@application/interfaces/services/externals/redis-cache.provider.interface";
import { PortfolioEntity } from "@domain/entities/portfolio/portfolio.entity";
import { EXTERNAL_TYPES } from "@infrastructure/inversify_di/features/external/external.types";
import { MUTUAL_FUND_TYPES } from "@infrastructure/inversify_di/features/mutual-fund/mutual-fund.types";
import { STOCK_TYPES } from "@infrastructure/inversify_di/features/stock/stock.types";
import { inject, injectable } from "inversify";
import { IAssetPriceResolver } from "../asset-price-resolver";

@injectable()
export class AssetPriceResolver implements IAssetPriceResolver {

    constructor(
        @inject(EXTERNAL_TYPES.RedisCacheProvider) private readonly cache: ICacheProvider,

        @inject(STOCK_TYPES.StockRepository) private readonly stockRepository: IStockRepository,

        @inject(STOCK_TYPES.MarketDataProvider) private readonly marketProvider: IMarketDataProvider,

        @inject(MUTUAL_FUND_TYPES.MutualFundRepository) private readonly mfRepository: IMutualFundRepository,

        @inject(MUTUAL_FUND_TYPES.MutualFundNavRepository) private readonly navRepository: IMutualFundNavRepository,
    ) { }

    async getPrices(assets: PortfolioEntity[]): Promise<Map<string, number>> {

        const priceMap = new Map<string, number>();

        await Promise.allSettled(
            assets.map(async (asset) => {

                if (asset.assetType === "STOCK") {
                    await this.resolveStockPrice(asset, priceMap);
                }

                if (asset.assetType === "MUTUAL_FUND") {
                    await this.resolveMfPrice(asset, priceMap);
                }
            })
        );

        return priceMap;
    }

    private async resolveStockPrice(asset: PortfolioEntity, priceMap: Map<string, number>) {

        const stock = await this.stockRepository.findById(asset.assetId);

        if (!stock) return;

        const cacheKey = `stock-price:${stock.symbol}`;

        const cached = await this.cache.get(cacheKey);

        if (cached) {
            priceMap.set(asset.assetId, Number(cached));
            return;
        }

        try {

            const quote =
                await this.marketProvider.getLatestQuote(stock.symbol);

            if (!quote) return;

            priceMap.set(asset.assetId, quote.price);

            await this.cache.set(
                cacheKey,
                quote.price.toString(),
                1800
            );

        } catch {

            // fallback to DB later
        }
    }

    private async resolveMfPrice(asset: PortfolioEntity, priceMap: Map<string, number>) {

        const fund =
            await this.mfRepository.findById(asset.assetId);

        if (!fund) return;

        const cacheKey = `mf-nav:${fund.schemeCode}`;

        const cached = await this.cache.get(cacheKey);

        if (cached) {
            priceMap.set(asset.assetId, Number(cached));
            return;
        }

        const latestNav = await this.navRepository.getLatestNav(fund.schemeCode);

        if (!latestNav) return;

        priceMap.set(asset.assetId, latestNav.nav);

        await this.cache.set(
            cacheKey,
            latestNav.nav.toString(),
            3600
        );
    }
}