import { SipInstallmentEntity } from "@domain/entities/mutual-fund/sip-intallment.entity";
import { BaseRepository } from "../base.repository";
import { SipInstallmentDocument } from "@infrastructure/databases/mongo_db/models/interfaces/mutual-fund/sip-intallment-schema-interface";
import { ISipInstallmentRepository } from "@application/interfaces/repositories/feature/sip-intallment-repository.interface";
import { SipInstallmentModel } from "@infrastructure/databases/mongo_db/models/schemas/mutual-fund/sip-intallment.schema";
import { SipInstallmentMapper } from "@infrastructure/mappers/mutual-fund/sip-intallment.mapper";
import { SipInstallmentStatus } from "@domain/enum/funds/sip-intallment-status";
import { QueryOptions, Types } from "mongoose";

export class SipInstallmentRepository extends BaseRepository<SipInstallmentEntity, SipInstallmentDocument>
    implements ISipInstallmentRepository {

    constructor() {
        super(SipInstallmentModel, SipInstallmentMapper)
    }

    async findActiveDueSips(): Promise<SipInstallmentEntity[]> {
        const now = new Date();
        const docs = await this.model.find({
            status: SipInstallmentStatus.PENDING,
            executionDate: { $lte: now }
        })
            .sort({ executionDate: 1 })
            .exec();

        return docs.map(doc => this.mapper.toDomain(doc));
    }



    async markFailed(installmentId: string, reason: string): Promise<void> {
        await this.model.findByIdAndUpdate(
            new Types.ObjectId(installmentId),
            {
                $set: {
                    status: SipInstallmentStatus.FAILED,
                    failureReason: reason
                }
            }
        )
    }

    async markSuccess(installmentId: string, investmentId: string): Promise<void> {

        await this.model.findByIdAndUpdate(
            new Types.ObjectId(installmentId),
            {
                $set: {
                    status: SipInstallmentStatus.SUCCESS,
                    investmentId: investmentId,
                    updatedAt: new Date()
                }
            }
        )
    }

    async findInstallmentsByUser(
        userId: string,
        options?: QueryOptions
    ): Promise<SipInstallmentEntity[] | null> {
        const { sipId, status, limit, skip, sort, ...otherFilters } = options || {};

        const filter: Record<string, unknown> = { userId: new Types.ObjectId(userId) };

        if (status) {
            filter.status = status;
        }

        if (sipId) {
            filter.sipId = new Types.ObjectId(sipId);
        }

        Object.assign(filter, otherFilters);

        let query = this.model.find(filter);

        if (sort) {
            query = query.sort(sort);
        } else {
            query = query.sort({ createdAt: -1 });
        }

        if (limit) {
            query = query.limit(limit);
        }

        if (skip) {
            query = query.skip(skip);
        }

        const docs = await query.exec();

        if (!docs || docs.length === 0) {
            return null;
        }

        return docs.map(doc => this.mapper.toDomain(doc));
    }

    async findInstallmentsBySip(
        userId: string,
        sipId: string
    ): Promise<SipInstallmentEntity[] | null> {


        const userObjectId = new Types.ObjectId(userId);
        const sipObjectId = new Types.ObjectId(sipId);

        const docs = await this.model
            .find({
                userId: userObjectId,
                sipId: sipObjectId
            })
            .sort({ installmentNo: 1 })
            .exec();

        if (!docs || docs.length === 0) {
            return null;
        }
        return docs.map(doc => this.mapper.toDomain(doc));
    }

    async countInstallments(
        userId: string,
        options?: QueryOptions
    ): Promise<number> {
        const { sipId, status, ...otherFilters } = options || {};

        const filter: Record<string, unknown> = { userId: new Types.ObjectId(userId) };

        if (status) {
            filter.status = status;
        }

        if (sipId) {
            filter.sipId = new Types.ObjectId(sipId);
        }

        Object.assign(filter, otherFilters);

        return await this.model.countDocuments(filter).exec();
    }
}