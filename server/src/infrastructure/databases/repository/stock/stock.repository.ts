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

    async saveMany(stocks: StockEntity[]): Promise<void> {

        const docs = stocks.map((stock) => ({
            symbol: stock.symbol,
            name: stock.name,
            exchange: stock.exchange,
            sector: stock.sector,
            status: stock.status,
            isTradable: stock.isTradable,
        }));

        await this.model.insertMany(docs, {
            ordered: false,
        });

    }

    async findBySymbol(symbol: string): Promise<StockEntity | null> {
        const document = await StockModel.findOne({ symbol }).lean();
        return document ? this.mapper.toDomain(document as unknown as StockDocument) : null;
    }
} 