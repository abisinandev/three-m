export interface ISignalService {
    createSignal(input: any): Promise<void>;
    processSignal(input: {
        userId: string;
        symbol: string;
        algoId: string;
        action: any;
        strategyName: string;
        price: number;
        reason: string;
    }): Promise<void>;
}