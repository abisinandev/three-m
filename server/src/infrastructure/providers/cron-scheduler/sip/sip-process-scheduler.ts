import { ExecuteDueSipUseCase } from '@application/use_cases/sip/execute-due-sip.usecase';
import { container } from '@infrastructure/inversify_di/container';
import cron from 'node-cron'

let isRunning = false;

export const StartSipScheduler = () => {
    cron.schedule(
        "0 6,9 * * * *",
        // "* * * * * * *",
        async () => {

            if (isRunning) {
                console.warn("[SIP SCHEDULER] Previous run still in progress. Skipping...");
                return;
            }

            isRunning = true;
            console.log("[SIP SCHEDULER] Started");
            try {
                const useCase = container.get<ExecuteDueSipUseCase>(ExecuteDueSipUseCase);
                await useCase.execute();

                console.log("[SIP SCHEDULER] Finished");

            } catch (error) {
                console.error("[SIP SCHEDULER] Failed", error);
            } finally {
                isRunning = false;
            }
        });
};
