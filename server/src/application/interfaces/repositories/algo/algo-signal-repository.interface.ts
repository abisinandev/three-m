import { AlgoSignalEntity } from "@domain/entities/algo/algo-signal.entity";
import { IBaseRepository } from "@application/interfaces/repositories/base-repository.interface";
import { QueryOptions } from "mongoose";

export interface IAlgoSignalRepository extends IBaseRepository<AlgoSignalEntity> {
    create(signal: AlgoSignalEntity): Promise<AlgoSignalEntity>;
    existsRecentSignal(userId: string, symbol: string, action: string, cooldownMinutes?: number): Promise<boolean>;
    getLastSignalAction(userId: string, symbol: string): Promise<string | null>;
    findAllSignalsWithFilter(query: QueryOptions): Promise<AlgoSignalEntity[]>;
    countSignals(): Promise<number>;
    countApprovedDailySignalsByStrategy(strategyName: string): Promise<number>;
}