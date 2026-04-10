import { AlgoSignalEntity } from "@domain/entities/algo/algo-signal.entity";
import { IBaseRepository } from "@application/interfaces/repositories/base-repository.interface";

export interface IAlgoSignalRepository extends IBaseRepository<AlgoSignalEntity> {
    create(signal: AlgoSignalEntity): Promise<AlgoSignalEntity>;
    existsRecentSignal(userId: string, symbol: string, algoId: string, action: string, cooldownMinutes?: number): Promise<boolean>;
}