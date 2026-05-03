export interface IMarketMoversResponse {
    gainers: any[];
    losers: any[];
}

export interface IGetMarketMoversUseCase {
    execute(): Promise<IMarketMoversResponse>;
}
