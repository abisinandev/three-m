import { inject, injectable } from "inversify";
import { ADMIN_TYPES } from "@infrastructure/inversify_di/features/admin/admin.types";
import { ISystemJobLogRepository } from "@application/interfaces/repositories/admin/system-job-log.repository.interface";
import { SystemJobLog } from "@domain/entities/admin/system-job-log.entity";
import { IGetSystemJobLogsUseCase } from "./interfaces/get-system-job-logs.interface";

@injectable()
export class GetSystemJobLogsUseCase implements IGetSystemJobLogsUseCase {
    constructor(
        @inject(ADMIN_TYPES.SystemJobLogRepository) private readonly _logRepository: ISystemJobLogRepository
    ) {}

    async execute(filters: { jobName?: string; status?: string; page?: number; limit?: number }): Promise<{ logs: SystemJobLog[]; total: number }> {
        const page = filters.page || 1;
        const limit = filters.limit || 20;
        const offset = (page - 1) * limit;

        return await this._logRepository.findAll({
            jobName: filters.jobName,
            status: filters.status,
            limit,
            offset
        });
    }
}
