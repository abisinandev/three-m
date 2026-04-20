import { injectable } from "inversify";
import { BaseRepository } from "../base.repository";
import { InvestmentEntity } from "@domain/entities/mutual-fund/investment.entity";
import { InvestmentDocument } from "@infrastructure/databases/mongo_db/models/interfaces/mutual-fund/investment.schema.interface";
import { InvestmentMapper } from "@infrastructure/mappers/mutual-fund/investment.mapper";
import { InvestmentModel } from "@infrastructure/databases/mongo_db/models/schemas/mutual-fund/investment.schema";
import { IInvestmentRepository } from "@application/interfaces/repositories/feature/investment-repository.interface";
import { InvestmentStatus } from "@domain/enum/funds/investment.enums";
import { ClientSession, QueryOptions, Types, PipelineStage } from "mongoose";
import { GroupedSchemeInvestments } from "@application/dto/portfolio/grouped-scheme-investments ";
import { InvestmentRedeemResult } from "@domain/types/radeem-units.types";

@injectable()
export class InvestmentRepository extends BaseRepository<InvestmentEntity, InvestmentDocument> implements IInvestmentRepository {
    constructor() {
        super(InvestmentModel, InvestmentMapper);
    }

    async createInvestment(entity: InvestmentEntity): Promise<InvestmentEntity | null> {
        const persistenceData = this.mapper.toPersistance(entity);
        const createdDoc = await this.model.create(persistenceData);
        return this.mapper.toDomain(createdDoc);
    }



    async findInitiatedFunds(): Promise<InvestmentEntity[] | null> {
        const docs = await this.model.find({ status: InvestmentStatus.INITIATED });
        if (!docs) return null;
        return docs.map(doc => this.mapper.toDomain(doc));
    };

    async countByUser(userId: string): Promise<number> {
        return await this.model.countDocuments({ userId })
    }

    async allotNav(data: {
        investmentId: string;
        nav: number;
        navDate: Date;
        units: number;
    }): Promise<void> {
        await this.model.findByIdAndUpdate(
            data.investmentId,
            {
                $set: {
                    nav: data.nav,
                    navDate: data.navDate,
                    units: data.units,
                    status: InvestmentStatus.ALLOTTED,
                },
            }
        );
    }

    async findByUsertotalInvestments(userId: string): Promise<number> {
        const result = await this.model.aggregate([
            {
                $match: {
                    userId: new Types.ObjectId(userId),
                    status: InvestmentStatus.ALLOTTED,
                },
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: "$amount" },
                },
            },
        ]);
        return result.length > 0 ? result[0] : 0;
    };


    async getUserInvestments(userId: string, options: QueryOptions): Promise<InvestmentEntity[]> {
        const {
            page = 1,
            limit = 10,
            filter = {},
            sortBy = "createdAt",
            sortOrder = "desc",
            search = "",
        } = options;

        const pageNumber = Math.max(Number(page), 1);
        const limitNumber = Math.max(Number(limit), 1);
        const skip = (pageNumber - 1) * limitNumber;

        const matchStage: Record<string, unknown> = {
            ...filter,
            userId: new Types.ObjectId(userId),
        };

        const sort: Record<string, 1 | -1> = {
            [sortBy]: sortOrder === "asc" ? 1 : -1,
        };

        const pipeline: PipelineStage[] = [
            { $match: matchStage },
            {
                $lookup: {
                    from: "mutualfunds",
                    localField: "schemeCode",
                    foreignField: "schemeCode",
                    as: "fund",
                },
            },
            {
                $unwind: {
                    path: "$fund",
                    preserveNullAndEmptyArrays: true,
                },
            },
        ];

        if (search) {
            pipeline.push({
                $match: {
                    $or: [
                        { schemeCode: { $regex: search, $options: "i" } },
                        { "fund.schemeName": { $regex: search, $options: "i" } },
                    ],
                },
            });
        }

        pipeline.push(
            { $sort: sort },
            { $skip: skip },
            { $limit: limitNumber },
            {
                $project: {
                    _id: 1,
                    userId: 1,
                    schemeCode: 1,
                    amount: 1,
                    units: 1,
                    nav: 1,
                    navDate: 1,
                    status: 1,
                    investmentType: 1,
                    paymentMethod: 1,
                    remainingUnits: 1,
                    redeemedUnits: 1,
                    redeemedAmount: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    fund: {
                        schemeName: 1,
                        category: 1,
                        risk: 1,
                        amc: 1,
                        logo: 1,
                    },
                },
            }
        );

        const docs = await this.model.aggregate(pipeline);
        return docs.map(doc => this.mapper.toDomain(doc));
    }

    async getUserInvestmentsWithoutFilter(userId: string): Promise<InvestmentEntity[]> {

        const docs = await this.model.aggregate([
            {
                $match: {
                    userId: new Types.ObjectId(userId),
                    status: InvestmentStatus.ALLOTTED,
                },
            },
            {
                $lookup: {
                    from: "mutualfunds",
                    localField: "schemeCode",
                    foreignField: "schemeCode",
                    as: "fund",
                },
            },
            {
                $unwind: {
                    path: "$fund",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $project: {
                    _id: 1,
                    userId: 1,
                    schemeCode: 1,
                    amount: 1,
                    units: 1,
                    nav: 1,
                    navDate: 1,
                    status: 1,
                    investmentType: 1,
                    paymentMethod: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    fund: {
                        schemeName: 1,
                        category: 1,
                        risk: 1,
                        amc: 1,
                        logo: 1,
                    },
                },
            },
        ]);

        return docs.map(doc => this.mapper.toDomain(doc));
    }

    async getTotalUnitsByUser(userId: string): Promise<number> {
        const result = await this.model.aggregate([
            {
                $match: {
                    userId: userId,
                    status: InvestmentStatus.ALLOTTED,
                },
            },
            {
                $group: {
                    _id: null,
                    totalUnits: { $sum: "$units" },
                },
            },
        ]);

        return result.length > 0 ? result[0].totalUnits : 0;

    }

    async getTotalUnitsByUserAndScheme(userId: string, schemeCode: string): Promise<InvestmentEntity[]> {
        const docs = await this.model.find({
            userId,
            schemeCode,
            status: InvestmentStatus.ALLOTTED
        });
        return docs.map(doc => this.mapper.toDomain(doc));
    }

    async findInvestmentsByUser(userId: string): Promise<InvestmentEntity[] | null> {
        const latestDoc = await this.model
            .findOne({ userId })
            .sort({ createdAt: -1 })
            .exec();

        if (!latestDoc) return null;

        const latestDate = new Date(latestDoc.createdAt);
        const startOfMonth = new Date(latestDate.getFullYear(), latestDate.getMonth(), 1);
        const endOfMonth = new Date(latestDate.getFullYear(), latestDate.getMonth() + 1, 0, 23, 59, 59);

        const docs = await this.model.find({
            userId,
            createdAt: { $gte: startOfMonth, $lte: endOfMonth },
        });

        return docs.map(doc => this.mapper.toDomain(doc));
    }


    async findGroupedInvestmentsByUser(userId: string): Promise<GroupedSchemeInvestments[]> {

        const docs = await this.model.aggregate([
            {
                $match: {
                    userId: new Types.ObjectId(userId),
                    status: InvestmentStatus.ALLOTTED
                }
            },
            {
                $group: {
                    _id: "$schemeCode",
                    totalUnits: { $sum: "$units" },
                    totalInvestment: { $sum: "$amount" },
                    investments: { $push: "$$ROOT" }
                }
            }, { $sort: { createdAt: 1 } },
        ]);

        return docs.map(doc => ({
            schemeCode: doc._id,
            totalUnits: doc.totalUnits,
            totalInvestment: doc.totalInvestment,
            investments: doc.investments.map((inv: InvestmentDocument) => this.mapper.toDomain(inv))
        }));
    }

    async getInvestmentForRadeem(userId: string, schemeCode: string): Promise<InvestmentEntity | null> {
        const doc = await this.model.findOne(
            {
                userId,
                schemeCode,
                status: InvestmentStatus.ALLOTTED,
                remainingUnits: { $gt: 0 },
            },
        )
        if (!doc) return null;
        return this.mapper.toDomain(doc);
    }


    async redeemInvestments(
        investmentId: string,
        userId: string,
        update: InvestmentRedeemResult,
        session: ClientSession
    ): Promise<void> {
        await this.model.findOneAndUpdate(
            {
                _id: investmentId,
                userId: new Types.ObjectId(userId),
            },
            { $set: update },
            { session }
        );
    };


    async getCurrentPortfolioValue(userId: string): Promise<number> {
        return 0;
    }

    async findUserInvestmentsForXirr(userId: string): Promise<InvestmentEntity[] | null> {
        const docs = await this.model.find({
            userId,
            status: { $in: [InvestmentStatus.ALLOTTED, InvestmentStatus.REDEEMED] }
        })
        if (!docs) return null;
        return docs.map(doc => this.mapper.toDomain(doc));
    }

    async countInvestments(userId: string, options: QueryOptions): Promise<number> {
        const {
            filter = {},
            search = "",
        } = options;

        const matchStage: Record<string, unknown> = {
            ...filter,
            userId: new Types.ObjectId(userId),
        };

        const pipeline: PipelineStage[] = [
            { $match: matchStage },
            {
                $lookup: {
                    from: "mutualfunds",
                    localField: "schemeCode",
                    foreignField: "schemeCode",
                    as: "fund",
                },
            },
            {
                $unwind: {
                    path: "$fund",
                    preserveNullAndEmptyArrays: true,
                },
            },
        ];

        if (search) {
            pipeline.push({
                $match: {
                    $or: [
                        { schemeCode: { $regex: search, $options: "i" } },
                        { "fund.schemeName": { $regex: search, $options: "i" } },
                    ],
                },
            });
        }

        pipeline.push({ $count: "total" });

        const result = await this.model.aggregate(pipeline);
        return result.length > 0 ? result[0].total : 0;
    }
}  