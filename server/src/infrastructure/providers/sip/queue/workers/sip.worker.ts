import { Worker, Job } from 'bullmq';
import { injectable } from 'inversify';
import { container } from '@infrastructure/inversify_di/container';
import { SIP_TYPES } from '@infrastructure/inversify_di/features/sip/sip.types';
import { IExecuteDueSipsUseCase } from '@application/use_cases/sip/interfaces/execute-due-sip-usecase.interface';
import { bullConnection } from '@infrastructure/providers/bullmq/queue.config';

@injectable()
export class SipWorker {
    private worker: Worker;

    constructor() {
        this.worker = new Worker(
            'sip-execution-queue',
            async (job: Job) => {
                if (job.name === 'execute-due-sips') {
                    console.log(`[SIP WORKER] Processing job: ${job.id}`);
                    try {
                        const useCase = container.get<IExecuteDueSipsUseCase>(SIP_TYPES.ExecuteDueSipUseCase);
                        await useCase.execute();

                    } catch (error) {
                        console.error(`[SIP WORKER] Error processing job: ${job.id}`, error);
                        throw error;
                    }
                }
            },
            {
                connection: bullConnection,
                concurrency: 1, 
            }
        );

        this.worker.on('failed', (job, err) => {
            console.error(`[SIP WORKER] Job ${job?.id} failed with error: ${err.message}`);
        });
    }
}
