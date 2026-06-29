export interface IStockUpdateUseCase {
    execute(symbol: string, statusUpdate: Partial<{ isTradable: boolean; isTracked: boolean; isVisible: boolean }>): Promise<boolean>;
}