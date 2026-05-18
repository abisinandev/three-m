import { BaseRepository } from "../base.repository";
import { PortfolioEntity } from "@domain/entities/portfolio/portfolio.entity";
import { IPortfolioRepository } from "@application/interfaces/repositories/feature/portfolio-repository.interface";
import { PortfolioModel, PortfolioDocument } from "../../mongo_db/models/schemas/portfolio/portfolio.schema";
import { injectable } from "inversify";
import { PortfolioMapper } from "@infrastructure/mappers/portfolio/portfolio.mapper";
import { ClientSession, QueryOptions, Types, PipelineStage } from "mongoose";
import { AssetType } from "@domain/entities/portfolio/enum/asset-type";
import { PortfolioStockDTO } from "@application/dto/portfolio/aggregated-asset.dto";
import { PortfolioStatus } from "@domain/entities/portfolio/enum/portfolio-status";

@injectable()
export class PortfolioRepository extends BaseRepository<PortfolioEntity, PortfolioDocument> implements IPortfolioRepository {
    constructor() {
        super(PortfolioModel, PortfolioMapper)
    }

    async findByUserIdAndSymbol(userId: string, assetId: string, session?: ClientSession): Promise<PortfolioEntity | null> {
        const result = await this.model.findOne({ userId, assetId }, null, { session });
        if (!result) return null;
        return this.mapper.toDomain(result);
    }

    async findByUserId(userId: string, session?: ClientSession): Promise<PortfolioEntity[]> {
        const results = await this.model.find(
            { userId, assetType: AssetType.STOCK, status: PortfolioStatus.ACTIVE },
            null,
            { session }
        );
        return results.map((doc) => this.mapper.toDomain(doc))
    }


    async findWithFilters(userId: string, options: QueryOptions): Promise<PortfolioStockDTO[]> {
        const {
            page = 1,
            limit = 10,
            filter = {},
            search = "",
            sortBy = "createdAt",
            sortOrder = "desc",
        } = options;

        const skip = (Number(page) - 1) * Number(limit);

        const matchStage: Record<string, unknown> = {
            ...filter,
            userId: new Types.ObjectId(userId),
            status: PortfolioStatus.ACTIVE,
        };

        const sort: Record<string, 1 | -1> = {
            [sortBy]: sortOrder === "asc" ? 1 : -1,
        };

        const pipeline: PipelineStage[] = [
            { $match: matchStage },
            {
                $lookup: {
                    from: "stocks",
                    localField: "assetId",
                    foreignField: "_id",
                    as: "stockDetails",
                },
            },
            {
                $unwind: {
                    path: "$stockDetails",
                    preserveNullAndEmptyArrays: true,
                },
            },
        ];

        if (search.trim()) {
            pipeline.push({
                $match: {
                    $or: [
                        { "stockDetails.symbol": { $regex: search.trim(), $options: "i" } },
                        { "stockDetails.name": { $regex: search.trim(), $options: "i" } },
                    ],
                },
            });
        }

        pipeline.push(
            { $sort: sort },
            { $skip: skip },
            { $limit: Number(limit) }
        );

        const docs = await this.model.aggregate(pipeline);
        return docs.map(doc => ({
            id: doc._id.toString(),
            userId: doc.userId.toString(),
            assetId: doc.assetId,
            assetType: doc.assetType,
            quantity: doc.quantity,
            units: doc.units,
            avgPrice: doc.avgPrice,
            investedAmount: doc.investedAmount,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
            stockDetails: doc.stockDetails
        }));
    }

    async countWithFilters(userId: string, filter: Record<string, unknown>, search: string): Promise<number> {
        const matchStage: Record<string, unknown> = {
            ...filter,
            userId: new Types.ObjectId(userId),
            status: PortfolioStatus.ACTIVE,
        };

        const pipeline: PipelineStage[] = [
            { $match: matchStage },
            {
                $lookup: {
                    from: "stocks",
                    localField: "assetId",
                    foreignField: "_id",
                    as: "stockDetails",
                },
            },
            {
                $unwind: {
                    path: "$stockDetails",
                    preserveNullAndEmptyArrays: true,
                },
            },
        ];

        if (search.trim()) {
            pipeline.push({
                $match: {
                    $or: [
                        { "stockDetails.symbol": { $regex: search.trim(), $options: "i" } },
                        { "stockDetails.name": { $regex: search.trim(), $options: "i" } },
                    ],
                },
            });
        }

        pipeline.push({ $count: "total" });

        const result = await this.model.aggregate(pipeline);
        return result.length > 0 ? result[0].total : 0;
    }

    async deleteByUserIdAndSymbol(userId: string, assetId: string, session?: ClientSession): Promise<boolean> {
        const result = await this.model.updateOne(
            { userId, assetId },
            {
                $set: {
                    status: PortfolioStatus.CLOSED,
                    quantity: 0,
                    units: 0,
                    investedAmount: 0,
                    lockQty: 0,
                    stopLoss: null,
                    takeProfit: null
                }
            },
            { session }
        );
        return result.modifiedCount > 0;
    }

    async getUserAssets(userId: string): Promise<PortfolioEntity[]> {
        const docs = await this.model.find({
            userId: new Types.ObjectId(userId),
            status: PortfolioStatus.ACTIVE
        });

        return docs.length ? docs.map(doc => this.mapper.toDomain(doc)) : [];

    }

    async countUserInvestements(userId: string): Promise<number> {
        return this.model.countDocuments({
            userId: new Types.ObjectId(userId),
            assetType: AssetType.MUTUAL_FUND,
            status: PortfolioStatus.ACTIVE
        });
    }

    async countUserStockHoldings(userId: string): Promise<number> {
        return this.model.countDocuments({
            userId: new Types.ObjectId(userId),
            assetType: AssetType.STOCK,
            status: PortfolioStatus.ACTIVE
        });
    }

    async calculateTotalStockAUM(): Promise<number> {
        const result = await this.model.aggregate([
            { $match: { assetType: AssetType.STOCK, status: PortfolioStatus.ACTIVE } },
            { $group: { _id: null, total: { $sum: "$investedAmount" } } }
        ]);
        return result.length > 0 ? result[0].total : 0;
    }


}
