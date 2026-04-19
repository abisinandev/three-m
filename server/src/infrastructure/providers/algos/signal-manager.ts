import { ISignalManager, SignalState } from "@application/interfaces/repositories/algo/signal-manager.interface";
import { SignalAction } from "@domain/entities/algo/enum/signal-enums";
import { injectable } from "inversify";
import { redisClient } from "@infrastructure/providers/redis/redis.provider";

@injectable()
export class SignalManager implements ISignalManager {
    private readonly PREFIX = "algo_signal_state:";
    private readonly TTL = 24 * 60 * 60;

    public async shouldEmitSignal(
        algoId: string,
        symbol: string,
        action: SignalAction | null
    ): Promise<boolean> {
        const key = `${this.PREFIX}${algoId}_${symbol}`;

        if (action === null) {
            await redisClient.del(key);
            return false;
        }

        const prevRaw = await redisClient.get(key);
        const prev: SignalState | null = prevRaw ? JSON.parse(prevRaw) : null;

        if (!prev || prev.lastAction !== action) {
            const newState: SignalState = {
                lastAction: action,
                timestamp: Date.now()
            };
            
            await redisClient.set(
                key, 
                JSON.stringify(newState), 
                "EX", 
                this.TTL
            );
            return true;
        }

        return false;
    }
}