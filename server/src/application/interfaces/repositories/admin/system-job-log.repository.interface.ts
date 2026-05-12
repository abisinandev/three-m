import { SystemJobLog } from "@domain/entities/admin/system-job-log.entity";

export interface ISystemJobLogRepository {
    create(log: SystemJobLog): Promise<SystemJobLog>;
    update(log: SystemJobLog): Promise<SystemJobLog | null>;
    findById(id: string): Promise<SystemJobLog | null>;
    findAll(filters: { jobName?: string; status?: string; limit?: number; offset?: number }): Promise<{ logs: SystemJobLog[]; total: number }>;
}
