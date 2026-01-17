import { MutualFundNavUpdate } from '@application/use_cases/mutual-fund/mutual-fund-nav-update.usecase';
import { NavInterval } from '@domain/enum/funds/nav-intervals.enums';
import { container } from '@infrastructure/inversify_di/inversify.di';
import cron from 'node-cron';

export function NavYearScheduler() {
    cron.schedule(
        "0 2,3 * * *",
        async () => {
            console.log("[NAV-CRON] NAV sync started");

            try {
                const useCase = container.get<MutualFundNavUpdate>(MutualFundNavUpdate);
                await useCase.execute(NavInterval.YEARLY);

                console.log("[NAV-CRON] NAV sync completed");
            } catch (error) {
                console.error("[NAV-CRON] NAV sync failed", error);
            }
        },
        {
            timezone: "Asia/Kolkata",
        }
    );
}