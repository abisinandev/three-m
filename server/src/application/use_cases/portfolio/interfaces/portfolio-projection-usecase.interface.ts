import { PortfolioProjectionDTO, PortfolioProjectionResponseDTO } from "@application/dto/portfolio/portfolio-projection.dto";

export interface IPortfolioProjectionUseCase {
    execute(data: PortfolioProjectionDTO, userId: string): Promise<PortfolioProjectionResponseDTO>;
}