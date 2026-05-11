import { InvestmentDTO } from "@application/dto/mutual-funds/investment-dto";

export interface IOneTimeInvestmentUseCase {
    execute(data: InvestmentDTO, userId: string, idempotencyKey: string): Promise<void>;
}