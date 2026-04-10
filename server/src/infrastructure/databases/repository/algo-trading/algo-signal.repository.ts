import { AlgoSignalEntity } from "@domain/entities/algo/algo-signal.entity";
import { BaseRepository } from "../base.repository";
import { AlgoSignalDocument, AlgoSignalModel } from "@infrastructure/databases/mongo_db/models/schemas/algo-trading/algo-signal.schema";
import { IAlgoSignalRepository } from "@application/interfaces/repositories/algo/algo-signal-repository.interface";
import { AlgoSignalMapper } from "@infrastructure/mappers/algo/algo-signal.mapper";

export class AlgoSignalRepository extends
    BaseRepository<AlgoSignalEntity, AlgoSignalDocument> implements IAlgoSignalRepository {

    constructor() {
        super(AlgoSignalModel, AlgoSignalMapper)
    }

    async create(signal: AlgoSignalEntity): Promise<AlgoSignalEntity> {
        const data = this.mapper.toPersistance(signal);
        const doc = await this.model.create(data);
        return this.mapper.toDomain(doc)
    }

    async existsRecentSignal(userId: string, symbol: string, algoId: string, action: string, cooldownMinutes: number = 30): Promise<boolean> {
        const lookback = new Date(Date.now() - cooldownMinutes * 60 * 1000);
        const latestSignal = await AlgoSignalModel.findOne({
            userId,
            symbol,
            algoId,
            createdAt: { $gte: lookback }
        }).sort({ createdAt: -1 });

        if (latestSignal && latestSignal.action === action) {
            return true;
        }
        return false;
    }

}