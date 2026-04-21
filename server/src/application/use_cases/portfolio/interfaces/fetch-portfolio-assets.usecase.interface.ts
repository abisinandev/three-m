import { PortfolioAssetQueryDTO } from "@application/dto/portfolio/portfolio-asset-query.dto";
import { PaginatedPortfolioAssetsResponseDTO } from "@application/dto/portfolio/portfolio-asset-response.dto";

export interface IFetchPortfolioAssetsUsecase {
    execute(userId: string, query: PortfolioAssetQueryDTO): Promise<PaginatedPortfolioAssetsResponseDTO>;
}