import { IStockRepository } from "@application/interfaces/repositories/stock/stock-repository.interface";
import { StockEntity } from "@domain/entities/stock/stock.entity";
import { StockDocument, StockModel } from "@infrastructure/databases/mongo_db/models/schemas/stock/stock.schema";
import { BaseRepository } from "@infrastructure/databases/repository/base.repository";
import { StockMapper } from "@infrastructure/mappers/stock/stock.mapper";
import { injectable } from "inversify";

@injectable()
export class StockRepository extends BaseRepository<StockEntity, StockDocument> implements IStockRepository {
    constructor() {
        super(StockModel, StockMapper)
    }

    public async saveMany(stocks: StockEntity[]): Promise<void> {
        if (!stocks.length) return;

        const bulkOps = stocks.map((entity) => {
            const persistenceModel = StockMapper.toPersistance(entity);
            return {
                updateOne: {
                    filter: { symbol: persistenceModel.symbol },
                    update: { $set: persistenceModel },
                    upsert: true
                }
            };
        });

        await StockModel.bulkWrite(bulkOps);
    }

    public async findBySymbol(symbol: string): Promise<StockEntity | null> {
        const document = await StockModel.findOne({ symbol }).lean();
        return document ? this.mapper.toDomain(document as unknown as StockDocument) : null;
    }
} 