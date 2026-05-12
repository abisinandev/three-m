import { inject, injectable } from "inversify";
import { IDispatchLimitOrdersUseCase } from "./interfaces/dispatch-limit-orders.interface";
import { STOCK_TYPES } from "@infrastructure/inversify_di/features/stock/stock.types";
import { IOrderRepository } from "@application/interfaces/repositories/stock/order-repository.interface";
import { IOrderQueue } from "@application/interfaces/services/stocks/order-queue.interface";
import { logger } from "@infrastructure/providers/logger/pino.logger";

@injectable()
export class DispatchLimitOrdersUseCase implements IDispatchLimitOrdersUseCase {
    constructor(
        @inject(STOCK_TYPES.OrderRepository) private readonly _orderRepository: IOrderRepository,
        @inject(STOCK_TYPES.OrderQueue) private readonly _orderQueue: IOrderQueue,
    ) { }

    async execute(): Promise<void> {
        try {
            const pendingOrders = await this._orderRepository.findPendingLimitOrders();

            if (pendingOrders.length > 0) {
                logger.info(`[DispatchLimitOrdersUseCase] Dispatching ${pendingOrders.length} pending limit orders to queue`);
            }

            for (const order of pendingOrders) {
                await this._orderQueue.addLimitOrderJob(order.id as string);
            }
        } catch (error) {
            logger.error({ error }, "[DispatchLimitOrdersUseCase] Error during execution");
        }
    }
}
