import { RadeemDTO } from "@application/dto/portfolio/radeem.dto";

export interface IRadeemInvestmentUseCase {
    execute(userId: string): Promise<RadeemDTO[]>;
}