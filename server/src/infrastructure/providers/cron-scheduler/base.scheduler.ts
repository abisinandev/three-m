import cron, { ScheduledTask } from 'node-cron';
import { injectable } from 'inversify';
import { IScheduler } from '@application/interfaces/services/common/scheduler.interface';

@injectable()
export abstract class BaseScheduler implements IScheduler {
    protected cronJob: ScheduledTask | null = null;
    protected isRunning = false;

    constructor(
        protected readonly name: string,
        protected readonly schedule: string,
        protected readonly timezone: string = "Asia/Kolkata"
    ) {}

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
            try {
                await this.execute();
            } catch (error) {
                console.error(`[${this.name}] Execution failed:`, error);
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
