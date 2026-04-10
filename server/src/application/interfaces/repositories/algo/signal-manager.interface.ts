import { SignalAction } from "@domain/entities/algo/enum/signal-enums";

export interface SignalState {
    lastAction: SignalAction;
    timestamp: number;
}

export interface ISignalManager {
    shouldEmitSignal(algoId: string, symbol: string, action: SignalAction | null): boolean;
}