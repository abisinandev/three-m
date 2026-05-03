import { AlgoStrategyRiskConfig } from "@domain/entities/algo/algo-strategy-config.entity";
import { AlgoStrategyConfigDocument } from "@infrastructure/databases/mongo_db/models/schemas/algo-trading/algo-strategy-config.schema";

export class AlgoStrategyConfigMapper {
    public static toDomain(doc: AlgoStrategyConfigDocument): AlgoStrategyRiskConfig {
        return AlgoStrategyRiskConfig.fromPersistence({
            id: doc._id.toString(),
            strategyName: doc.strategyName,
            riskAmount: doc.riskAmount,
            maxTradesPerDay: doc.maxTradesPerDay,
            stopLoss: doc.stopLoss,
            takeProfit: doc.takeProfit,
            updatedAt: doc.updatedAt,
        });
    }

    public static toPersistence(entity: AlgoStrategyRiskConfig): any {
        return {
            strategyName: entity.strategyName,
            riskAmount: entity.riskAmount,
            maxTradesPerDay: entity.maxTradesPerDay,
            stopLoss: entity.stopLoss,
            takeProfit: entity.takeProfit,
        };
    }
}
