export enum JobStatus {
    RUNNING = "RUNNING",
    SUCCESS = "SUCCESS",
    FAILED = "FAILED"
}

export interface ISystemJobLog {
    id?: string;
    jobName: string;
    status: JobStatus;
    startTime: Date;
    endTime?: Date;
    duration?: number; // in milliseconds
    processedCount: number;
    failedCount: number;
    errorMessage?: string;
    metadata?: Record<string, unknown>;
    createdAt?: Date;
    updatedAt?: Date;
}

export class SystemJobLog {
    public id?: string;
    public jobName: string;
    public status: JobStatus;
    public startTime: Date;
    public endTime?: Date;
    public duration?: number;
    public processedCount: number;
    public failedCount: number;
    public errorMessage?: string;
    public metadata?: Record<string, unknown>;
    public createdAt?: Date;
    public updatedAt?: Date;

    constructor(data: ISystemJobLog) {
        this.id = data.id;
        this.jobName = data.jobName;
        this.status = data.status;
        this.startTime = data.startTime;
        this.endTime = data.endTime;
        this.duration = data.duration;
        this.processedCount = data.processedCount || 0;
        this.failedCount = data.failedCount || 0;
        this.errorMessage = data.errorMessage;
        this.metadata = data.metadata;
        this.createdAt = data.createdAt || new Date();
        this.updatedAt = data.updatedAt || new Date();
    }

    static create(jobName: string, metadata?: Record<string, unknown>): SystemJobLog {
        return new SystemJobLog({
            jobName,
            status: JobStatus.RUNNING,
            startTime: new Date(),
            processedCount: 0,
            failedCount: 0,
            metadata
        });
    }

    complete(processedCount: number, failedCount: number = 0): void {
        this.status = JobStatus.SUCCESS;
        this.endTime = new Date();
        this.duration = this.endTime.getTime() - this.startTime.getTime();
        this.processedCount = processedCount;
        this.failedCount = failedCount;
        this.updatedAt = new Date();
    }

    fail(errorMessage: string, processedCount: number = 0, failedCount: number = 1): void {
        this.status = JobStatus.FAILED;
        this.endTime = new Date();
        this.duration = this.endTime.getTime() - this.startTime.getTime();
        this.errorMessage = errorMessage;
        this.processedCount = processedCount;
        this.failedCount = failedCount;
        this.updatedAt = new Date();
    }
}
