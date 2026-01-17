import { InvestmentDTO } from "@application/dto/mutual-funds/investment-dto";

export interface IInvestmentUseCase {
    execute(data: InvestmentDTO, userId: string): Promise<void>;
}