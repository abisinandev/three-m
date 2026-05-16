import { IAlgoSignalStateRepository } from "@application/interfaces/repositories/algo/algo-signal-state-repository.interface";
import { SignalAction } from "@domain/entities/algo/enum/signal-enums";
import { SignalStateModel } from "@infrastructure/databases/mongo_db/models/schemas/algo-trading/algo-signal-state.schema";
import { injectable } from "inversify";

@injectable()
export class AlgoSignalStateRepository implements IAlgoSignalStateRepository {

    async getLastAction(algoId: string, symbol: string): Promise<SignalAction | null> {
        const state = await SignalStateModel.findOne({ algoId, symbol });
        return state ? (state.lastAction as SignalAction) : null;
    }

    async updateLastAction(algoId: string, symbol: string, action: SignalAction): Promise<void> {
        await SignalStateModel.findOneAndUpdate(
            { algoId, symbol },
            {
                lastAction: action,
                timestamp: Date.now()
            },
            { upsert: true }
        );
    }

    async clearLastAction(algoId: string, symbol: string): Promise<void> {
        await SignalStateModel.deleteOne({ algoId, symbol });
    }
}
