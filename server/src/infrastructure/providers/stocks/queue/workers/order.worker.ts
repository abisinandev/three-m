import { Worker, Job } from 'bullmq';
import { injectable, inject } from 'inversify';
import { STOCK_TYPES } from '@infrastructure/inversify_di/features/stock/stock.types';
import { IExecuteLimitBuyOrderUseCase } from '@application/use_cases/stock/interfaces/execute-limit-buy-order.interface';
import { IExecuteLimitSellOrderUseCase } from '@application/use_cases/stock/interfaces/execute-limit-sell-order.interface';
import { IOrderRepository } from '@application/interfaces/repositories/stock/order-repository.interface';
import { bullConnection } from '@infrastructure/providers/algos/queue/queue.config';
import { OrderSide } from '@domain/entities/stock/enum/order-side.enum';

@injectable()
export class OrderWorker {
    private worker: Worker;

    constructor(
        @inject(STOCK_TYPES.ExecuteLimitBuyOrderUseCase) private readonly _executeLimitBuyOrder: IExecuteLimitBuyOrderUseCase,
        @inject(STOCK_TYPES.ExecuteLimitSellOrderUseCase) private readonly _executeLimitSellOrder: IExecuteLimitSellOrderUseCase,
        @inject(STOCK_TYPES.OrderRepository) private readonly _orderRepository: IOrderRepository
    ) {
        this.worker = new Worker(
            'order-queue',
            this.process.bind(this),
            { 
                connection: bullConnection, 
                concurrency: 5,
                lockDuration: 60000 // 60 seconds
            }
        );


        this.worker.on('failed', (job, err) => {
            console.error(`❌ Order job ${job?.id} failed: ${err.message}`);
        }); 

        this.worker.on('completed', (job) => {
            console.log(`✅ Order job ${job.id} processed successfully`);
        });
    }

    private async process(job: Job<{ orderId: string }>) {
        const { orderId } = job.data;
        console.log(`📦 Processing order execution for ${orderId}`);

        try {
            if (job.name === 'execute-limit-order') {
                const order = await this._orderRepository.findById(orderId);
                if (!order) return;

                if (order.side === OrderSide.BUY) {
                    await this._executeLimitBuyOrder.execute(orderId);
                } else if (order.side === OrderSide.SELL) {
                    await this._executeLimitSellOrder.execute(orderId);
                }
            }
        } catch (error) {
            console.error(`Error in OrderWorker for job ${job.id}:`, error);
            throw error;
        }
    }
}
