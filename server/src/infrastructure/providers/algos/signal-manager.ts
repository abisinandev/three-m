import { ISignalManager, SignalState } from "@application/interfaces/repositories/algo/signal-manager.interface";
import { SignalAction } from "@domain/entities/algo/enum/signal-enums";
import { injectable } from "inversify";

@injectable()
export class SignalManager implements ISignalManager {
    private state = new Map<string, SignalState>();

    public shouldEmitSignal(
        algoId: string,
        symbol: string,
        action: SignalAction | null
    ): boolean {
        const key = `${algoId}_${symbol}`;

        if (action === null) {
            this.state.delete(key);
            return false;
        }

        const prev = this.state.get(key);

        if (!prev || prev.lastAction !== action) {
            this.state.set(key, {
                lastAction: action,
                timestamp: Date.now()
            });
            return true;
        }

        return false;
    }
}