import { container } from "@infrastructure/inversify_di/container";
import { MUTUAL_FUND_TYPES } from "@infrastructure/inversify_di/features/mutual-fund/mutual-fund.types";
import { SIP_TYPES } from "@infrastructure/inversify_di/features/sip/sip.types";
import { STOCK_TYPES } from "@infrastructure/inversify_di/features/stock/stock.types";
import { StrategyScheduler } from "@infrastructure/providers/algos/strategy-scheduler";
import { CagrUpdateScheduler } from "@infrastructure/providers/cron-scheduler/mutual-fund/cagr-cron-scheduler";
import { NavAllocationScheduler } from "@infrastructure/providers/cron-scheduler/mutual-fund/nav-allocatation-scheduler";
import { NavDailyScheduler } from "@infrastructure/providers/cron-scheduler/mutual-fund/nav-cron.scheduler";
import { SipScheduler } from "@infrastructure/providers/sip/queue/sip.scheduler";
import { FailedSipScheduler } from "@infrastructure/providers/sip/queue/failed-sip.scheduler";
import { LimitOrderScheduler } from "@infrastructure/providers/stocks/queue/limit-order-scheduler";
import { SlTpOrderScheduler } from "@infrastructure/providers/stocks/queue/sl-tp-order.scheduler";

export const startSchedulers = async () => {

    container.get<NavDailyScheduler>(MUTUAL_FUND_TYPES.NavDailyScheduler).start();

    container.get<CagrUpdateScheduler>(MUTUAL_FUND_TYPES.CagrUpdateScheduler).start();
    
    container.get<NavAllocationScheduler>(MUTUAL_FUND_TYPES.NavAllocationScheduler).start();

    container.get<LimitOrderScheduler>(STOCK_TYPES.LimitOrderScheduler).start();

    container.get<StrategyScheduler>(STOCK_TYPES.StrategyScheduler).start();

    container.get<SlTpOrderScheduler>(STOCK_TYPES.SlTpOrderScheduler).start();

    container.get<SipScheduler>(SIP_TYPES.SipScheduler).start();

    container.get<FailedSipScheduler>(SIP_TYPES.FailedSipScheduler).start();
}