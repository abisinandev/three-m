import { AlgoStrategyEntity } from "@domain/entities/algo/algo-strategy.entity";
import { BaseRepository } from "../base.repository";
import { AlgoStrategyDocument, AlgoStrategyModel } from "@infrastructure/databases/mongo_db/models/schemas/algo/algo-strategy.schema";
import { IAlgoStrategyRepository } from "@application/interfaces/repositories/algo/algo-strategy-repository.interface";
import { AlgoStrategyMapper } from "@infrastructure/mappers/algo/algo-strategy.mapper";

export class AlgoStrategyRepository extends
    BaseRepository<AlgoStrategyEntity, AlgoStrategyDocument> implements IAlgoStrategyRepository {

    constructor() {
        super(AlgoStrategyModel, AlgoStrategyMapper)
    }
}
