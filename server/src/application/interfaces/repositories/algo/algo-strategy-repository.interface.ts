import { AlgoStrategyEntity } from "@domain/entities/algo/algo-strategy.entity";
import { IBaseRepository } from "@application/interfaces/repositories/base-repository.interface";

export interface IAlgoStrategyRepository extends IBaseRepository<AlgoStrategyEntity> {
    getAllActive(): Promise<AlgoStrategyEntity[]>;
}
