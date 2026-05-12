import { inject, injectable } from "inversify";
import { ADMIN_TYPES } from "@infrastructure/inversify_di/features/admin/admin.types";
import { ISystemJobLogRepository } from "@application/interfaces/repositories/admin/system-job-log.repository.interface";
import { SystemJobLog } from "@domain/entities/admin/system-job-log.entity";
import { logger } from "@infrastructure/providers/logger/pino.logger";
import { IJobLoggerService } from "./interfaces/job-logger.service.interface";

@injectable()
export class JobLoggerService implements IJobLoggerService {
    constructor(
        @inject(ADMIN_TYPES.SystemJobLogRepository) private readonly _logRepository: ISystemJobLogRepository
    ) {}

    async start(jobName: string, metadata?: Record<string, unknown>): Promise<SystemJobLog> {
        const log = SystemJobLog.create(jobName, metadata);
        return await this._logRepository.create(log);
    }

    async complete(log: SystemJobLog, processedCount: number, failedCount: number = 0): Promise<void> {
        log.complete(processedCount, failedCount);
        await this._logRepository.update(log);
        // logger.info({ jobName: log.jobName, duration: log.duration, processedCount }, "[JobLogger] Completed");
    }

    async fail(log: SystemJobLog, errorMessage: string, processedCount: number = 0, failedCount: number = 1): Promise<void> {
        log.fail(errorMessage, processedCount, failedCount);
        await this._logRepository.update(log);
        logger.error({ jobName: log.jobName, duration: log.duration, error: errorMessage }, "[JobLogger] Failed");
    }

    async wrap<T>(jobName: string, fn: (log: SystemJobLog) => Promise<T>, metadata?: Record<string, unknown>): Promise<T> {
        const log = await this.start(jobName, metadata);
        try {
            const result = await fn(log);
            if (log.status === "RUNNING") {
                await this.complete(log, 1);
            }
            return result;
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Unknown error";
            await this.fail(log, message);
            throw error;
        }
    }
}
