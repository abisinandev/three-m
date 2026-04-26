import { SipEntity } from "@domain/entities/mutual-fund/sip.entity";
import { BaseRepository } from "../base.repository";
import { SipDocument } from "@infrastructure/databases/mongo_db/models/interfaces/mutual-fund/sip.schema.interface";
import { ISipRepository } from "@application/interfaces/repositories/feature/sip-repository.interface";
import { SipModel } from "@infrastructure/databases/mongo_db/models/schemas/mutual-fund/sip.schema";
import { SipMapper } from "@infrastructure/mappers/mutual-fund/sip.mapper";
import { ClientSession, QueryOptions } from "mongoose";
import { injectable } from "inversify";
import { SipStatus } from "@domain/enum/funds/sip.enums";

@injectable()
export class SipRepository extends BaseRepository<SipEntity, SipDocument> implements ISipRepository {

    constructor() {
        super(SipModel, SipMapper)
    }

    async createSip(entity: SipEntity, session: ClientSession): Promise<SipEntity | null> {
        const data = this.mapper.toPersistance(entity);
        const doc = await this.model.create([data], { session });
        if (!doc) return null;
        return this.mapper.toDomain(doc[0]);
    }


    async fetchAllSips(options: QueryOptions): Promise<SipEntity[]> {
        const {
            page = 1,
            limit = 10,
            search = "",
            searchField = ["userId", "schemeCode"],
            sortBy = "createdAt",
            sortOrder = "desc",
            filter = {},
        } = options;

        const skip = (page - 1) * limit;

        type SipFilter = Record<string, unknown> & {
            $or?: Array<Record<string, unknown>>;
        };

        const finalFilter: SipFilter = { ...filter };

        if (search.trim()) {
            const searchRegex = { $regex: search.trim(), $options: "i" };
            finalFilter.$or = searchField.map((field: string) => ({
                [field]: searchRegex,
            }));
        }

        const sort: Record<string, 1 | -1> = {
            [sortBy]: sortOrder === "asc" ? 1 : -1,
        };

        const docs = await this.model
            .find(finalFilter)
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .exec();

        return Promise.all(docs.map((doc) => this.mapper.toDomain(doc)));
    }

    async findActiveSips(): Promise<{ totalActiveSips: number, datas: SipEntity[] }> {
        const data = await this.model.find({ status: SipStatus.ACTIVE });
        const totalActiveSips = await this.model.countDocuments({ status: SipStatus.ACTIVE });
        if (!data) return { datas: [], totalActiveSips };
        return {
            totalActiveSips,
            datas: data.map(item => this.mapper.toDomain(item)),
        }
    }

    async findSipsByUser(options: QueryOptions, userId: string): Promise<SipEntity[] | null> {
        const {
            page = 1,
            limit = 10,
            search = "",
            searchField = ["schemeCode"],
            sortBy = "createdAt",
            sortOrder = "desc",
            filter = {},
        } = options;


        const skip = (page - 1) * limit;

        type SipFilter = Record<string, unknown> & {
            $or?: Array<Record<string, unknown>>;
        };

        const finalFilter: SipFilter = { ...filter };

        if (search.trim()) {
            const searchRegex = { $regex: search.trim(), $options: "i" };
            finalFilter.$or = searchField.map((field: string) => ({
                [field]: searchRegex,
            }));
        }

        const sort: Record<string, 1 | -1> = {
            [sortBy]: sortOrder === "asc" ? 1 : -1,
        };

        const docs = await this.model
            .find(finalFilter)
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .exec();

        return Promise.all(docs.map((doc) => this.mapper.toDomain(doc)));
    }

    async pause(sipId: string): Promise<void> {
        await this.model.findByIdAndUpdate(
            sipId,
            { $set: { status: SipStatus.PAUSED } }
        )
    };
    async resume(sipId: string): Promise<void> {
        await this.model.findByIdAndUpdate(
            sipId,
            { $set: { status: SipStatus.ACTIVE } }
        )
    };
    async cancel(sipId: string): Promise<void> {
        await this.model.findByIdAndUpdate(
            sipId,
            { $set: { status: SipStatus.CANCELLED } }
        )
    };

    async findUserActiveSips(userId: string, limit = 3): Promise<SipEntity[]> {
        const docs = await this.model
            .find({ userId, status: SipStatus.ACTIVE })
            .sort({ nextExecutionDate: 1 })
            .limit(limit)
            .exec();
        return docs.map(doc => this.mapper.toDomain(doc));
    }
}