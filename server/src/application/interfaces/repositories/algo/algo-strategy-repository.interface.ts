import { AlgoStrategyEntity } from "@domain/entities/algo/algo-strategy.entity";
import { AlgoStrategyDocument } from "@infrastructure/databases/mongo_db/models/schemas/algo/algo-strategy.schema";
import { IBaseRepository } from "@application/interfaces/repositories/base-repository.interface";

export interface IAlgoStrategyRepository extends IBaseRepository<AlgoStrategyEntity> {
}
