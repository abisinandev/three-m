import { inject, injectable } from "inversify";
import { IDispatchSlTpOrdersUseCase } from "./interfaces/dispatch-sl-tp-orders.interface";
import { STOCK_TYPES } from "@infrastructure/inversify_di/features/stock/stock.types";
import { IOrderRepository } from "@application/interfaces/repositories/stock/order-repository.interface";
import { ISlTpOrderQueue } from "@application/interfaces/services/stocks/sl-tp-order-queue.interface";
import { logger } from "@infrastructure/providers/logger/pino.logger";

@injectable()
export class DispatchSlTpOrdersUseCase implements IDispatchSlTpOrdersUseCase {
    constructor(
        @inject(STOCK_TYPES.OrderRepository) private readonly _orderRepository: IOrderRepository,
        @inject(STOCK_TYPES.SlTpOrderQueue) private readonly _slTpOrderQueue: ISlTpOrderQueue,
    ) { }

    async execute(): Promise<void> {
        try {
            const filledOrders = await this._orderRepository.findFilledOrders() ?? [];

            if (filledOrders.length > 0) {
                logger.info(`[DispatchSlTpOrdersUseCase] Dispatching ${filledOrders.length} filled orders for SL/TP monitoring`);
            }

            for (const order of filledOrders) {
                await this._slTpOrderQueue.addSlTpQueue(order.id as string);
            }
        } catch (error) {
            logger.error({ error }, "[DispatchSlTpOrdersUseCase] Error during execution");
        }
    }
}
