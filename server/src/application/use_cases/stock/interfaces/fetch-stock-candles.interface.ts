export interface IFetchStockCandlesUseCase {
    execute(symbol: string, resolution: string, from: number, to: number): Promise<any>;
}
