import { BaseRepository } from "../base.repository";
import { PortfolioEntity } from "@domain/entities/portfolio/portfolio.entity";
import { IPortfolioRepository } from "@application/interfaces/repositories/feature/portfolio-repository.interface";
import { PortfolioModel, PortfolioDocument } from "../../mongo_db/models/schemas/portfolio/portfolio.schema";
import { injectable } from "inversify";
import { PortfolioMapper } from "@infrastructure/mappers/portfolio/portfolio.mapper";
import { ClientSession, QueryOptions } from "mongoose";
import { AssetType } from "@domain/entities/portfolio/enum/asset-type";

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
            { userId, assetType: AssetType.STOCK },
            null,
            { session }
        );
        return results.map((doc) => this.mapper.toDomain(doc))
    }

    async findWithFilters(userId: string, options: QueryOptions): Promise<PortfolioEntity[]> {
        const {
            page = 1,
            limit = 10,
            filter = {},
            search = "",
            sortBy = "createdAt",
            sortOrder = "desc",
        } = options;

        const skip = (Number(page) - 1) * Number(limit);

        const finalFilter: Record<string, unknown> = {
            ...filter,
            userId,
        };

        if (search.trim()) {
            finalFilter.assetId = { $regex: search.trim(), $options: "i" };
        }

        const sort: Record<string, 1 | -1> = {
            [sortBy]: sortOrder === "asc" ? 1 : -1,
        } as any;

        const docs = await this.model
            .find(finalFilter)
            .sort(sort)
            .skip(skip)
            .limit(Number(limit))
            .exec();

        return Promise.all(docs.map((doc) => this.mapper.toDomain(doc)));
    }

    async countWithFilters(userId: string, filter: Record<string, unknown>, search: string): Promise<number> {
        const finalFilter: Record<string, unknown> = {
            ...filter,
            userId
        };

        if (search.trim()) {
            finalFilter.assetId = { $regex: search.trim(), $options: "i" };
        }

        return await this.model.countDocuments(finalFilter);
    }

    async deleteByUserIdAndSymbol(userId: string, assetId: string, session?: ClientSession): Promise<boolean> {
        const result = await this.model.deleteOne({ userId, assetId }, { session });
        return result.deletedCount > 0;
    }


    // async findUserInvestments(userId: string, session?: ClientSession): Promise<PortfolioEntity | null> {
    //     const docs = await this.model.aggregate([
    //         { $match: { userId, assetType: AssetType.MUTUAL_FUND } },
    //         {
    //             $lookup: {
    //                 from: 'mutualfund',
    //                 localField: 'assetId',
    //                 foreignField: '_id',
    //                 as: 'fundDetails',
    //             }
    //         },
    //         { $unwind: "$fundDetails" },
    //     ])

    //     console.log("mf: ", docs);
    //     if (!docs) return null;

    //     return docs.map(doc => this.mapper.toDomain(doc));
    // }
}
