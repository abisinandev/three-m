import { MfCagrUseCase } from '@application/use_cases/mutual-fund/mf-cagr-usecase';
import { container } from '@infrastructure/inversify_di/inversify.di';
import cron from 'node-cron'

export function CagrUpdateScheduler() {
    cron.schedule("0 2,3 * * *",
        async () => {
            console.log("CAGR updated");
            try {
                const useCase = container.get<MfCagrUseCase>(MfCagrUseCase);
                await useCase.execute();

                console.log("CAGR updation completed");
            } catch (error) {
                console.error("CAGR updation failed", error);
            }
        }
    );
}