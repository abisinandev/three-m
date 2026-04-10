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

    async existsRecentSignal(userId: string, symbol: string, algoId: string): Promise<boolean> {
        const windowInMinutes = 30; 
        const lookback = new Date(Date.now() - windowInMinutes * 60 * 1000);
        const signal = await AlgoSignalModel.findOne({
            userId,
            symbol,
            algoId,
            createdAt: { $gte: lookback }
        });
        return !!signal;
    }
    
}