import { IStockRepository } from "@application/interfaces/repositories/stock/stock-repository.interface";
import { StockEntity } from "@domain/entities/stock/stock.entity";
import { StockQueryOptions } from "@application/dto/stocks/stock.dto";
import { StockDocument, StockModel } from "@infrastructure/databases/mongo_db/models/schemas/stock/stock.schema";
import { BaseRepository } from "@infrastructure/databases/repository/base.repository";
import { StockMapper } from "@infrastructure/mappers/stock/stock.mapper";
import { injectable } from "inversify";
import { FilterQuery } from "mongoose";

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

    async finAllStocks(options: StockQueryOptions): Promise<{ data: StockEntity[], total: number }> {
        const { page, limit, search, exchange, isTradable, isTracked, isVisible, sort } = options;

        const query: FilterQuery<StockDocument> = {};

        if (search) {
            query.$or = [
                { symbol: { $regex: search, $options: "i" } },
                { name: { $regex: search, $options: "i" } },
            ];
        }

        if (exchange) query.exchange = exchange;
        if (isTradable !== undefined) query.isTradable = isTradable;
        if (isTracked !== undefined) query.isTracked = isTracked;
        if (isVisible !== undefined) query.isVisible = isVisible;

        const skip = (page - 1) * limit;
        const sortOrder = sort ?? { symbol: 1 };

        const [documents, total] = await Promise.all([
            StockModel.find(query).skip(skip).limit(limit).sort(sortOrder).lean(),
            StockModel.countDocuments(query),
        ]);

        return {
            data: documents.map(doc => this.mapper.toDomain(doc as unknown as StockDocument)),
            total,
        };
    }

    async updateStatus(symbol: string, statusUpdate: Partial<{ isTradable: boolean; isTracked: boolean; isVisible: boolean }>): Promise<boolean> {
        const result = await StockModel.updateOne({ symbol }, { $set: statusUpdate });
        return result.modifiedCount > 0;
    }
}
