import { AlgoSignalEntity } from "@domain/entities/algo/algo-signal.entity";
import { BaseRepository } from "../base.repository";
import { AlgoSignalDocument, AlgoSignalModel } from "@infrastructure/databases/mongo_db/models/schemas/algo/algo-schema";
import { IAlgoSignalRepository } from "@application/interfaces/repositories/algo/algo-signal-reposiotry.interface";
import { AlgoSignalMapper } from "@infrastructure/mappers/algo/algo-signal.mapper";

export class AlgoSignalRepository extends
    BaseRepository<AlgoSignalEntity, AlgoSignalDocument> implements IAlgoSignalRepository {

    constructor() {
        super(AlgoSignalModel, AlgoSignalMapper)
    }
    
}