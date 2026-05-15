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
import { InvestmentFundDTO } from "@application/dto/portfolio/aggregated-asset.dto";
import { PortfolioGrowthPoint } from "@application/dto/user/dashboard.dto";

@injectable()
export class InvestmentRepository extends BaseRepository<InvestmentEntity, InvestmentDocument> implements IInvestmentRepository {
    constructor() {
        super(InvestmentModel, InvestmentMapper);
    }

    async createInvestment(entity: InvestmentEntity, session?: ClientSession): Promise<InvestmentEntity | null> {
        const persistenceData = this.mapper.toPersistance(entity);
        let createdDoc;
        if (session) {
            const docs = await this.model.create([persistenceData], { session });
            createdDoc = docs[0];
        } else {
            createdDoc = await this.model.create(persistenceData);
        }
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
        return result.length > 0 ? result[0].total : 0;
    };

    async getUserInvestments(userId: string, options: QueryOptions): Promise<InvestmentFundDTO[]> {
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
            userId: new Types.ObjectId(userId)
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
        return docs.map(doc => ({
            id: doc._id.toString(),
            userId: doc.userId.toString(),
            schemeCode: doc.schemeCode,
            amount: doc.amount,
            units: doc.units,
            nav: doc.nav,
            navDate: doc.navDate,
            status: doc.status,
            investmentType: doc.investmentType,
            paymentMethod: doc.paymentMethod,
            remainingUnits: doc.remainingUnits,
            redeemedUnits: doc.redeemedUnits,
            redeemedAmount: doc.redeemedAmount,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
            fund: doc.fund
        }));
    }


    async getUserInvestementSummary(userId: string): Promise<InvestmentFundDTO[]> {

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
            },
        ]);

        return docs.map(doc => ({
            id: doc._id.toString(),
            userId: doc.userId.toString(),
            schemeCode: doc.schemeCode,
            amount: doc.amount,
            units: doc.units,
            nav: doc.nav,
            navDate: doc.navDate,
            status: doc.status,
            investmentType: doc.investmentType,
            paymentMethod: doc.paymentMethod,
            remainingUnits: doc.remainingUnits,
            redeemedUnits: doc.redeemedUnits,
            redeemedAmount: doc.redeemedAmount,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
            fund: doc.fund
        }));
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
        const docs = await this.model.find({ userId });
        if (!docs || docs.length === 0) return null;
        return docs.map(doc => this.mapper.toDomain(doc));
    }

    async findInvestmentsHistory(userId: string): Promise<InvestmentFundDTO[]> {
        const docs = await this.model.aggregate([
            {
                $match: {
                    userId: new Types.ObjectId(userId),
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
            { $sort: { createdAt: -1 } },
        ]);

        return docs.map(doc => ({
            id: doc._id.toString(),
            userId: doc.userId.toString(),
            schemeCode: doc.schemeCode,
            amount: doc.amount,
            units: doc.units,
            nav: doc.nav,
            navDate: doc.navDate,
            status: doc.status,
            investmentType: doc.investmentType,
            paymentMethod: doc.paymentMethod,
            remainingUnits: doc.remainingUnits,
            redeemedUnits: doc.redeemedUnits,
            redeemedAmount: doc.redeemedAmount,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
            fund: doc.fund
        }));
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

    async portfolioGrowthByMonth(userId: string): Promise<PortfolioGrowthPoint[]> {
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
        sixMonthsAgo.setDate(1);
        sixMonthsAgo.setHours(0, 0, 0, 0);

        const docs = await this.model.aggregate([
            {
                $match: {
                    userId: new Types.ObjectId(userId),
                    status: InvestmentStatus.ALLOTTED,
                    createdAt: { $gte: sixMonthsAgo },
                },
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" },
                    },
                    total: { $sum: "$amount" },
                },
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } },
        ]);

        const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        const now = new Date();
        const slots: PortfolioGrowthPoint[] = [];
        for (let i = 5; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            slots.push({ month: MONTH_NAMES[d.getMonth()], amount: 0 });
        }

        for (const doc of docs) {
            const d = new Date(doc._id.year, doc._id.month - 1, 1);
            const monthName = MONTH_NAMES[d.getMonth()];
            const slot = slots.find(s => s.month === monthName);
            if (slot) slot.amount += doc.total;
        }

        let cumulative = 0;
        for (const slot of slots) {
            cumulative += slot.amount;
            slot.amount = cumulative;
        }

        return slots;
    }

    async calculateTotalAUM(): Promise<number> {
        const mfResult = await this.model.aggregate([
            { $match: { status: InvestmentStatus.ALLOTTED } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);
        return mfResult.length > 0 ? mfResult[0].total : 0;
    }
}  