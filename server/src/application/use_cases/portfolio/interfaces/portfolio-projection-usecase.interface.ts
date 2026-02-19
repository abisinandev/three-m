import { PortfolioProjectionDTO } from "@application/dto/portfolio/portfolio-projection.dto";

export interface IPortfolioProjectionUseCase {
    execute(data: PortfolioProjectionDTO, userId: string): Promise<any>;
}