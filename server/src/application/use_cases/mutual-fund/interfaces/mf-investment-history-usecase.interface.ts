import { InvestmentResponseDTO } from "@application/dto/mutual-funds/investment-response.dto";

export interface IMfInvestmentHistoryUseCase{
    execute(userId: string): Promise<InvestmentResponseDTO[]>;
}