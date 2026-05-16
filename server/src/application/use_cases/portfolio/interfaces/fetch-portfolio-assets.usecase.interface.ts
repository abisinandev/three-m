import { PortfolioAssetQueryDTO } from "@application/dto/portfolio/portfolio-asset-query.dto";
import { PortfolioAssetsResponseDTO } from "@application/dto/portfolio/portfolio-asset-response.dto";

export interface IFetchPortfolioAssetsUsecase {
    execute(userId: string, query: PortfolioAssetQueryDTO): Promise<PortfolioAssetsResponseDTO>;
}