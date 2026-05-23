export interface IMarketMoversResponse {
    gainers: unknown[];
    losers: unknown[];
}

export interface IGetMarketMoversUseCase {
    execute(): Promise<IMarketMoversResponse>;
}
