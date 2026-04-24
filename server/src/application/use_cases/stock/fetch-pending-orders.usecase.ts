import { inject, injectable } from "inversify";
import { STOCK_TYPES } from "@infrastructure/inversify_di/features/stock/stock.types";
import { IOrderRepository } from "@application/interfaces/repositories/stock/order-repository.interface";
import { IFetchPendingOrdersUseCase } from "./interfaces/fetch-pending-orders-usecase.interface";
import { OrderEntity } from "@domain/entities/stock/order.entity";

@injectable()
export class FetchPendingOrdersUseCase implements IFetchPendingOrdersUseCase {
    constructor(
        @inject(STOCK_TYPES.OrderRepository) private readonly _orderRepository: IOrderRepository,
    ) { }

    async execute(userId: string, symbol?: string): Promise<OrderEntity[]> {
        return this._orderRepository.findPendingLimitOrdersByUserId(userId, symbol);
    }
}
