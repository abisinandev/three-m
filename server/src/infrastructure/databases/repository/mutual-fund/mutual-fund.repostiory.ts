import { injectable } from "inversify";
import { BaseRepository } from "../base.repository";
import { MutualFundEntity } from "@domain/entities/mutual-fund/mutual-fund-entity";
import { MutualFundModel } from '@infrastructure/databases/mongo_db/models/schemas/mutual-fund/mutual-fund.schema'
import { MutualFundMapper } from "@infrastructure/mappers/mutual-fund/mutual-fund.mapper";
import { MutualFundDocument } from "@infrastructure/databases/mongo_db/models/interfaces/mutual-fund/mutual-fund-schema.interface";
import { ClientSession, QueryOptions } from "mongoose";
import { IMutualFundRepository } from "@application/interfaces/repositories/feature/mutual-fund-repository.interface";

@injectable()
export class MutualFundRepository extends BaseRepository<MutualFundEntity, MutualFundDocument> implements IMutualFundRepository {
    constructor() {
        super(MutualFundModel, MutualFundMapper);
    }

    async findAllFunds(options: QueryOptions): Promise<MutualFundEntity[]> {
        const {
            page = 1,
            limit = 10,
            filter = {},
            search = "",
            searchField = ["category", "schemeName"],
            sortBy = "createdAt",
            sortOrder = "desc",

        } = options;

        console.log("Filter", filter)

        const pageNumber = Number(page) || 1;
        const limitNumber = Number(limit) || 10;
        const skip = (pageNumber - 1) * limitNumber;

        type FilterFund = Record<string, unknown> & {
            $or?: Array<Record<string, unknown>>;
        };

        const finalFilter: FilterFund = { ...filter };

        if (search.trim()) {
            const searchRegex = { $regex: search.trim(), $options: "i" };
            finalFilter.$or = searchField.map((field: string) => ({
                [field]: searchRegex,
            }));
        }

        const sort: Record<string, 1 | -1> = {
            [sortBy]: sortOrder === "asc" ? 1 : -1,
        };

        const docs = await this.model.aggregate([
            { $match: finalFilter },
            { $sort: sort },
            { $skip: skip },
            { $limit: limitNumber },
            {
                $lookup: {
                    from: "mutualfundnavs",
                    let: { schemeCode: "$schemeCode" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$schemeCode", "$$schemeCode"] },
                                        { $eq: ["$interval", "DAILY"] }
                                    ]
                                }
                            }
                        },
                        { $sort: { navDate: -1 } },
                        { $limit: 1 },
                    ],
                    as: "latestNav",
                },
            },
            {
                $unwind: {
                    path: "$latestNav",
                    preserveNullAndEmptyArrays: true,
                },
            },
        ]);

        return docs.map((doc) => this.mapper.toDomain(doc));
    };


    async createFund(entities: MutualFundEntity, session?: ClientSession): Promise<void> {
        const doc = this.mapper.toPersistance(entities);
        await this.model.create(doc);
    };

    async findBySchemeCode(schemeCode: string): Promise<MutualFundEntity | null> {
        const doc = await this.model.findOne({ schemeCode });
        if (!doc) return null;
        return this.mapper.toDomain(doc);
    };

    async saveFunds(date: Date, nav: number): Promise<void> {
        await this.model.create({});
    };


    async findActiveFunds(): Promise<{ funds: MutualFundEntity[], countActiveFunds: number }> {
        const docs = await this.model.find({ status: "Active" });
        const count = await this.model.countDocuments({ status: "Active" });
        return {
            funds: docs.map(doc => this.mapper.toDomain(doc)),
            countActiveFunds: count,
        };
    };

    async findInactiveFunds(): Promise<{ funds: MutualFundEntity[]; countInactiveFunds: number; }> {
        const docs = await this.model.find({ status: "Inactive" });
        const count = await this.model.countDocuments({ status: "Inactive" });
        return {
            funds: docs.map(doc => this.mapper.toDomain(doc)),
            countInactiveFunds: count,
        };
    };
};