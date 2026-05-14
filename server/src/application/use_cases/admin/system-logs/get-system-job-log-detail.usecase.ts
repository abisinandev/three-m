import { inject, injectable } from "inversify";
import { ADMIN_TYPES } from "@infrastructure/inversify_di/features/admin/admin.types";
import { ISystemJobLogRepository } from "@application/interfaces/repositories/admin/system-job-log.repository.interface";
import { SystemJobLog } from "@domain/entities/admin/system-job-log.entity";
import { IGetSystemJobLogDetailUseCase } from "./interfaces/get-system-job-log-detail.interface";

@injectable()
export class GetSystemJobLogDetailUseCase implements IGetSystemJobLogDetailUseCase {
    constructor(
        @inject(ADMIN_TYPES.SystemJobLogRepository) private readonly _logRepository: ISystemJobLogRepository
    ) {}

    async execute(id: string): Promise<SystemJobLog | null> {
        return await this._logRepository.findById(id);
    }
}
