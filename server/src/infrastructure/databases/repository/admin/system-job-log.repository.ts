import { ISystemJobLogRepository } from "@application/interfaces/repositories/admin/system-job-log.repository.interface";
import { SystemJobLog, JobStatus } from "@domain/entities/admin/system-job-log.entity";
import { SystemJobLogModel, ISystemJobLogDocument } from "@infrastructure/databases/mongo_db/models/schemas/admin/system-job-log.schema";
import { injectable } from "inversify";
import { FilterQuery } from "mongoose";

@injectable()
export class SystemJobLogRepository implements ISystemJobLogRepository {

    private mapToEntity(doc: ISystemJobLogDocument): SystemJobLog {
        return new SystemJobLog({
            id: doc._id.toString(),
            jobName: doc.jobName,
            status: doc.status,
            startTime: doc.startTime,
            endTime: doc.endTime,
            duration: doc.duration,
            processedCount: doc.processedCount,
            failedCount: doc.failedCount,
            errorMessage: doc.errorMessage,
            metadata: doc.metadata,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt
        });
    }

    async create(log: SystemJobLog): Promise<SystemJobLog> {
        const doc = await SystemJobLogModel.create({
            jobName: log.jobName,
            status: log.status,
            startTime: log.startTime,
            metadata: log.metadata,
            processedCount: log.processedCount,
            failedCount: log.failedCount
        });
        return this.mapToEntity(doc);
    }

    async update(log: SystemJobLog): Promise<SystemJobLog | null> {
        if (!log.id) return null;

        const doc = await SystemJobLogModel.findByIdAndUpdate(log.id, {
            status: log.status,
            endTime: log.endTime,
            duration: log.duration,
            processedCount: log.processedCount,
            failedCount: log.failedCount,
            errorMessage: log.errorMessage,
            metadata: log.metadata,
        }, { new: true });

        if (!doc) return null
        return this.mapToEntity(doc);
    }

    async findById(id: string): Promise<SystemJobLog | null> {
        const doc = await SystemJobLogModel.findById(id);
        return doc ? this.mapToEntity(doc) : null;
    }

    async findAll(filters: { jobName?: string; status?: string; limit?: number; offset?: number }): Promise<{ logs: SystemJobLog[]; total: number }> {
        const query: FilterQuery<ISystemJobLogDocument> = {};
        if (filters.jobName) query.jobName = filters.jobName;
        if (filters.status) query.status = filters.status as JobStatus;

        const [docs, total] = await Promise.all([
            SystemJobLogModel.find(query)
                .sort({ startTime: -1 })
                .skip(filters.offset || 0)
                .limit(filters.limit || 50),
            SystemJobLogModel.countDocuments(query)
        ]);

        return {
            logs: docs.map(doc => this.mapToEntity(doc)),
            total
        };
    }
}
