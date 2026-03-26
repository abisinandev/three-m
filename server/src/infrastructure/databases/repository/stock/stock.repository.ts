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
            isTradable: stock.isTradable,
            isVisible: stock.isVisible,
            isTracked: stock.isTracked,
        }));

        await this.model.insertMany(docs, {
            ordered: false,
        });

    }

    async findBySymbol(symbol: string): Promise<StockEntity | null> {
        const document = await StockModel.findOne({ symbol }).lean();
        return document ? this.mapper.toDomain(document as unknown as StockDocument) : null;
    }

    async findFilteredPaginated(filters: any, skip: number, limit: number): Promise<{ data: StockEntity[], total: number }> {
        const query: any = {};
        
        if (filters.search) {
            query.$or = [
                { symbol: { $regex: filters.search, $options: "i" } },
                { name: { $regex: filters.search, $options: "i" } }
            ];
        }
        
        if (filters.exchange) query.exchange = filters.exchange;
        if (filters.isTradable !== undefined) query.isTradable = filters.isTradable === 'true' || filters.isTradable === true;
        if (filters.isTracked !== undefined) query.isTracked = filters.isTracked === 'true' || filters.isTracked === true;
        if (filters.isVisible !== undefined) query.isVisible = filters.isVisible === 'true' || filters.isVisible === true;

        const [documents, total] = await Promise.all([
            StockModel.find(query).skip(skip).limit(limit).sort({ symbol: 1 }).lean(),
            StockModel.countDocuments(query)
        ]);

        return {
            data: documents.map(doc => this.mapper.toDomain(doc as unknown as StockDocument)),
            total
        };
    }

    async updateStatus(symbol: string, statusUpdate: Partial<{ isTradable: boolean; isTracked: boolean; isVisible: boolean }>): Promise<boolean> {
        const result = await StockModel.updateOne({ symbol }, { $set: statusUpdate });
        return result.modifiedCount > 0;
    }
} 