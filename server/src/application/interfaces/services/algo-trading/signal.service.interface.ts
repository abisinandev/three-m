export interface ISignalService {
    createSignal(input: {
        userId: string;
        symbol: string;
        algoId: string;
        action: "BUY" | "SELL";
        strategyName: string;
        price: number;
        reason: string;
    }): Promise<void>;
}