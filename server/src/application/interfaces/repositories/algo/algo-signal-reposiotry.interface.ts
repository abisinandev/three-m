import { AlgoSignalEntity } from "@domain/entities/algo/algo-signal.entity";
import { AlgoSignalDocument } from "@infrastructure/databases/mongo_db/models/schemas/algo/algo-schema";
import { BaseRepository } from "@infrastructure/databases/repository/base.repository";

export interface IAlgoSignalRepository extends BaseRepository<AlgoSignalEntity, AlgoSignalDocument> {
}