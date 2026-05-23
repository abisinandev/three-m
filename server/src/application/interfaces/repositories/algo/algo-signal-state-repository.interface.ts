import { SignalAction } from "@domain/entities/algo/enum/signal-enums";

export interface IAlgoSignalStateRepository {
    getLastAction(algoId: string, symbol: string): Promise<SignalAction | null>;
    updateLastAction(algoId: string, symbol: string, action: SignalAction): Promise<void>;
    clearLastAction(algoId: string, symbol: string): Promise<void>;
}
