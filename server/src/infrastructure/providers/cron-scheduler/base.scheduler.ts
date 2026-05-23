import cron, { ScheduledTask } from 'node-cron';
import { injectable } from 'inversify';
import { IScheduler } from '@application/interfaces/services/common/scheduler.interface';
import { ADMIN_TYPES } from '@infrastructure/inversify_di/features/admin/admin.types';
import { container } from '@infrastructure/inversify_di/container';
import { IJobLoggerService } from '@application/services/admin/interfaces/job-logger.service.interface';
import { JobLoggerService } from '@application/services/admin/job-logger.service';

@injectable()
export abstract class BaseScheduler implements IScheduler {
    protected cronJob: ScheduledTask | null = null;
    protected isRunning = false;
    private _jobLogger: IJobLoggerService;

    constructor(
        protected readonly name: string,
        protected readonly schedule: string,
        protected readonly timezone: string = "Asia/Kolkata"
    ) {
        this._jobLogger = container.get<JobLoggerService>(ADMIN_TYPES.JobLoggerService);
    }

    protected abstract execute(): Promise<void>;

    public start(): void {
        if (this.cronJob) return;

        // console.log(`[${this.name}] Scheduler started (${this.schedule})`);

        this.cronJob = cron.schedule(this.schedule, async () => {
            if (this.isRunning) {
                // console.log(`[${this.name}] Previous execution still running, skipping...`);
                return;
            }

            this.isRunning = true;
            const log = await this._jobLogger.start(this.name);
            try {
                await this.execute();
                await this._jobLogger.complete(log, 1);
            } catch (error: unknown) {
                console.error(`[${this.name}] Execution failed:`, error);
                const err = error as Error;
                await this._jobLogger.fail(log, err.message || "Unknown error");
            } finally {
                this.isRunning = false;
            }
        }, {
            timezone: this.timezone
        });
    }

    public stop(): void {
        if (this.cronJob) {
            this.cronJob.stop();
            this.cronJob = null;
            // console.log(`[${this.name}] Scheduler stopped`);
        }
    }
}
