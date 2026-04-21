import { PortfolioSummaryDTO } from "@application/dto/portfolio/portfolio-summary.dto";

export interface IPortfolioSummaryUseCase {
    execute(userId: string): Promise<PortfolioSummaryDTO>;
}
