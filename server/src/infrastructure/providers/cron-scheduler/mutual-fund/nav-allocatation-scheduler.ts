import { NavAllocateUseCase } from '@application/use_cases/mutual-fund/nav-allocatation-usecase';
import { container } from '@infrastructure/inversify_di/container';
import cron from 'node-cron';

let isRunning = false;
export function NavAllocationScheduler() {
    cron.schedule(
        // "* * * * *",
        "0 2,3,9 * * *",
        
        async () => {
            console.log("[NAV-CRON] NAV allocation");
            if (isRunning) return;
            isRunning = true;

            try {
                const useCase = container.get<NavAllocateUseCase>(NavAllocateUseCase);
                await useCase.execute();

                console.log("[NAV-CRON] NAV Allocation completed");
            } catch (error) {
                console.error("[NAV-CRON] NAV Allocation failed", error);
                isRunning = false;
            }
        },
        {
            timezone: "Asia/Kolkata",
        }
    );
};     