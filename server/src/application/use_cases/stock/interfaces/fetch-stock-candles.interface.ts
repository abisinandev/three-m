import { CandlesResponseDTO } from "@application/dto/stocks/candle.dto";

export interface FetchStockCandlesInput {
    symbol: string;
    resolution: string;
    from: number;
    to: number;
}

export interface IFetchStockCandlesUseCase {
    execute(input: FetchStockCandlesInput): Promise<CandlesResponseDTO>;
}