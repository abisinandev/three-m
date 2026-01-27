import { injectable } from "inversify";
import { BaseRepository } from "../base.repository";
import { InvestmentEntity } from "@domain/entities/mutual-fund/investment.entity";
import { InvestmentDocument } from "@infrastructure/databases/mongo_db/models/interfaces/mutual-fund/investment.schema.interface";
import { InvestmentMapper } from "@infrastructure/mappers/mutual-fund/investment.mapper";
import { InvestmentModel } from "@infrastructure/databases/mongo_db/models/schemas/mutual-fund/investment.schema";
import { IInvestmentRepository } from "@application/interfaces/repositories/feature/investment-repository.interface";
import { InvestmentStatus } from "@domain/enum/funds/investment.enums";
import { ClientSession, QueryOptions, Types } from "mongoose";
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
        return result.length > 0 ? result[0].total : 0;
    };


    async getUserInvestments(
        userId: string,
        options: QueryOptions
    ): Promise<InvestmentEntity[]> {

        const {
            page = 1,
            limit = 10,
            filter = {},
            sortBy = "createdAt",
            sortOrder = "desc",
        } = options;

        const pageNumber = Math.max(Number(page), 1);
        const limitNumber = Math.max(Number(limit), 1);
        const skip = (pageNumber - 1) * limitNumber;

        const finalFilter: Record<string, unknown> = {
            ...filter,
            userId: new Types.ObjectId(userId),
        };

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

    async getUserInvestmentsWithoutFilter(
        userId: string
    ): Promise<InvestmentEntity[]> {

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
        const docs = await this.model.find({ userId, status: InvestmentStatus.ALLOTTED });
        if (!docs) return null;
        return docs.map(doc => this.mapper.toDomain(doc));
    }

    async findGroupedInvestmentsByUser(
        userId: string
    ): Promise<GroupedSchemeInvestments[]> {

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
        const x = await this.model.findOneAndUpdate(
            {
                _id: investmentId,
                userId: new Types.ObjectId(userId),
            },
            { $set: update },
            { session }
        );
    }

}