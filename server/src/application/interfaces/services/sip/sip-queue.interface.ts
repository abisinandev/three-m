export interface ISipQueue {
    addSipExecutionJob(installmentId: string): Promise<void>;
}
