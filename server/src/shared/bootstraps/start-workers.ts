import { container } from "@infrastructure/inversify_di/container";
import { MUTUAL_FUND_TYPES } from "@infrastructure/inversify_di/features/mutual-fund/mutual-fund.types";
import { SIP_TYPES } from "@infrastructure/inversify_di/features/sip/sip.types";
import { STOCK_TYPES } from "@infrastructure/inversify_di/features/stock/stock.types";
import { SignalWorker } from "@infrastructure/providers/algos/queue/workers/signal.worker";
import { StrategyWorker } from "@infrastructure/providers/algos/queue/workers/strategy.worker";
import { NavUpdateWorker } from "@infrastructure/providers/mutual-fund/queue/workers/nav-update.worker";
import { SipWorker } from "@infrastructure/providers/sip/queue/workers/sip.worker";
import { OrderWorker } from "@infrastructure/providers/stocks/queue/workers/order.worker";
import { SlTpOrderWorker } from "@infrastructure/providers/stocks/queue/workers/sl-tp-order.worker";

export const startWorkers = async () => {

        container.get<NavUpdateWorker>(MUTUAL_FUND_TYPES.NavUpdateWorker);

        container.get<StrategyWorker>(STOCK_TYPES.StrategyWorker);

        container.get<SignalWorker>(STOCK_TYPES.SignalWorker);

        container.get<OrderWorker>(STOCK_TYPES.OrderWorker);

        container.get<SlTpOrderWorker>(STOCK_TYPES.SlTpOrderWorker);

        container.get<SipWorker>(SIP_TYPES.SipWorker);
}