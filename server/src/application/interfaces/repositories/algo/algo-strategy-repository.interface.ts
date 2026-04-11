import { AlgoStrategyEntity } from "@domain/entities/algo/algo-strategy.entity";
import { IBaseRepository } from "@application/interfaces/repositories/base-repository.interface";
import { QueryOptions } from "mongoose";

export interface IAlgoStrategyRepository extends IBaseRepository<AlgoStrategyEntity> {
    getAllActive(): Promise<AlgoStrategyEntity[]>;
    findWithFilters(options: QueryOptions): Promise<AlgoStrategyEntity[]>;
    countActiveStrategies(): Promise<number>;
}
