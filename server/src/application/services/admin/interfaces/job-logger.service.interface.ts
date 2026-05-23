import { SystemJobLog } from "@domain/entities/admin/system-job-log.entity";

export interface IJobLoggerService {
    start(jobName: string, metadata?: Record<string, unknown>): Promise<SystemJobLog>;
    complete(log: SystemJobLog, processedCount: number, failedCount?: number): Promise<void>;
    fail(log: SystemJobLog, errorMessage: string, processedCount?: number, failedCount?: number): Promise<void>;
    wrap<T>(jobName: string, fn: (log: SystemJobLog) => Promise<T>, metadata?: Record<string, unknown>): Promise<T>;
}
