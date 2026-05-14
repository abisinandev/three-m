import { SignalAction } from "@domain/entities/algo/enum/signal-enums";

export interface SignalJobData {
    userId: string;
    symbol: string;
    algoId?: string;
    action: SignalAction;
    strategyName: string;
    price: number;
    reason: string;
}

export interface ISignalQueue {
    addSignalJob(data: SignalJobData): Promise<void>;
}
