import { inject, injectable } from "inversify";
import { STOCK_TYPES } from "@infrastructure/inversify_di/features/stock/stock.types";
import { ADMIN_TYPES } from "@infrastructure/inversify_di/features/admin/admin.types";
import { IOrderRepository } from "@application/interfaces/repositories/stock/order-repository.interface";
import { IJobLoggerService } from "@application/services/admin/interfaces/job-logger.service.interface";
import { IExecuteLimitBuyOrderUseCase } from "./interfaces/execute-limit-buy-order.interface";
import { IExecuteLimitSellOrderUseCase } from "./interfaces/execute-limit-sell-order.interface";
import { IExecuteMarketBuyOrderUseCase } from "./interfaces/execute-market-buy-order.interface";
import { IExecuteMarketSellOrderUseCase } from "./interfaces/execute-market-sell-order.interface";
import { OrderSide } from "@domain/entities/stock/enum/order-side.enum";
import { IProcessOrderJobUseCase } from "./interfaces/process-order-job.interface";

@injectable()
export class ProcessOrderJobUseCase implements IProcessOrderJobUseCase {
    constructor(
        @inject(STOCK_TYPES.OrderRepository) private readonly _orderRepository: IOrderRepository,
        @inject(ADMIN_TYPES.JobLoggerService) private readonly _jobLogger: IJobLoggerService,
        @inject(STOCK_TYPES.ExecuteLimitBuyOrderUseCase) private readonly _executeLimitBuyOrder: IExecuteLimitBuyOrderUseCase,
        @inject(STOCK_TYPES.ExecuteLimitSellOrderUseCase) private readonly _executeLimitSellOrder: IExecuteLimitSellOrderUseCase,
        @inject(STOCK_TYPES.ExecuteMarketBuyOrderUseCase) private readonly _executeMarketBuyOrder: IExecuteMarketBuyOrderUseCase,
        @inject(STOCK_TYPES.ExecuteMarketSellOrderUseCase) private readonly _executeMarketSellOrder: IExecuteMarketSellOrderUseCase,
    ) {}

    async execute(jobName: string, orderId: string): Promise<void> {
        const log = await this._jobLogger.start(jobName, { orderId });

        try {
            const order = await this._orderRepository.findById(orderId);
            if (!order) {
                await this._jobLogger.fail(log, "Order not found", 0, 1);
                return;
            }

            if (jobName === 'execute-limit-order') {
                if (order.side === OrderSide.BUY) {
                    await this._executeLimitBuyOrder.execute(orderId);
                } else if (order.side === OrderSide.SELL) {
                    await this._executeLimitSellOrder.execute(orderId);
                }
            } else if (jobName === 'execute-market-order') {
                if (order.side === OrderSide.BUY) {
                    await this._executeMarketBuyOrder.execute(orderId);
                } else if (order.side === OrderSide.SELL) {
                    await this._executeMarketSellOrder.execute(orderId);
                }
            }
            
            await this._jobLogger.complete(log, 1);
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Unknown error";
            await this._jobLogger.fail(log, message, 0, 1);
            throw error;
        }
    }
}
