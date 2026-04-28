import { ISignalManager } from "@application/interfaces/repositories/algo/signal-manager.interface";
import { SignalAction } from "@domain/entities/algo/enum/signal-enums";
import { injectable } from "inversify";
import { SignalStateModel } from "@infrastructure/databases/mongo_db/models/schemas/algo-trading/algo-signal-state.schema";

@injectable()
export class SignalManager implements ISignalManager {

    public async shouldEmitSignal(
        algoId: string,
        symbol: string,
        action: SignalAction | null
    ): Promise<boolean> {

        if (action === null) {
            await SignalStateModel.deleteOne({ algoId, symbol });
            return false;
        }

        const prev = await SignalStateModel.findOne({ algoId, symbol });

        if (!prev || prev.lastAction !== action) {
            await SignalStateModel.findOneAndUpdate(
                { algoId, symbol },
                { 
                    lastAction: action, 
                    timestamp: Date.now() 
                },
                { upsert: true, new: true }
            );
            return true;
        }

        return false;
    }
}