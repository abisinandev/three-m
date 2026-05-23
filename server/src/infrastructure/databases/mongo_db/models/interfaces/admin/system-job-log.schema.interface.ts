import { Document } from "mongoose";
import { JobStatus } from "@domain/entities/admin/system-job-log.entity";

export interface ISystemJobLogDocument extends Document {
    jobName: string;
    status: JobStatus;
    startTime: Date;
    endTime?: Date;
    duration?: number;
    processedCount: number;
    failedCount: number;
    errorMessage?: string;
    metadata?: Record<string, unknown>;
    createdAt: Date;
    updatedAt: Date;
}
