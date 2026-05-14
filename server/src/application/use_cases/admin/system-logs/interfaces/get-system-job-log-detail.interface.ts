import { SystemJobLog } from "@domain/entities/admin/system-job-log.entity";

export interface IGetSystemJobLogDetailUseCase {
    execute(id: string): Promise<SystemJobLog | null>;
}
