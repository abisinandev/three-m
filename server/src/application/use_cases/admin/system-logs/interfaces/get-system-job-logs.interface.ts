import { SystemJobLog } from "@domain/entities/admin/system-job-log.entity";

export interface IGetSystemJobLogsUseCase {
    execute(filters: { jobName?: string; status?: string; page?: number; limit?: number }): Promise<{ logs: SystemJobLog[]; total: number }>;
}
