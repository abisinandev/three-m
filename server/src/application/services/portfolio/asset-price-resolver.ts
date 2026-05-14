import { PortfolioEntity } from "@domain/entities/portfolio/portfolio.entity";

export interface IAssetPriceResolver {
    getPrices(
        assets: PortfolioEntity[]
    ): Promise<Map<string, number>>;
}