import { IAlgoStrategyConfigRepository } from "@application/interfaces/repositories/algo/algo-strategy-config-repository.interface";
import { AlgoStrategyRiskConfig } from "@domain/entities/algo/algo-strategy-config.entity";
import { AlgoStrategyConfigModel } from "@infrastructure/databases/mongo_db/models/schemas/algo-trading/algo-strategy-config.schema";
import { AlgoStrategyConfigMapper } from "@infrastructure/mappers/algo/algo-strategy-config.mapper";
import { injectable } from "inversify";

@injectable()
export class AlgoStrategyConfigRepository implements IAlgoStrategyConfigRepository {
    async findByStrategyName(strategyName: string): Promise<AlgoStrategyRiskConfig | null> {
        const doc = await AlgoStrategyConfigModel.findOne({ strategyName });
        return doc ? AlgoStrategyConfigMapper.toDomain(doc) : null;
    }

    async findAll(): Promise<AlgoStrategyRiskConfig[]> {
        const docs = await AlgoStrategyConfigModel.find();
        return docs.map((doc) => AlgoStrategyConfigMapper.toDomain(doc));
    }

    async save(config: AlgoStrategyRiskConfig): Promise<AlgoStrategyRiskConfig> {
        const data = AlgoStrategyConfigMapper.toPersistence(config);
        const doc = await AlgoStrategyConfigModel.findOneAndUpdate(
            { strategyName: config.strategyName },
            { $set: data },
            { upsert: true, new: true }
        );
        return AlgoStrategyConfigMapper.toDomain(doc);
    }
}
