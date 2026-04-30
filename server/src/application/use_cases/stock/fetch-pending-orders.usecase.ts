import { inject, injectable } from "inversify";
import { STOCK_TYPES } from "@infrastructure/inversify_di/features/stock/stock.types";
import { IOrderRepository } from "@application/interfaces/repositories/stock/order-repository.interface";
import { PendingOrderResponseDTO } from "@application/dto/stock/pending-order.dto";
import { IFetchPendingOrdersUseCase } from "./interfaces/fetch-pending-orders-usecase.interface";

@injectable()
export class FetchPendingOrdersUseCase implements IFetchPendingOrdersUseCase {
    constructor(
        @inject(STOCK_TYPES.OrderRepository) private readonly _orderRepository: IOrderRepository,
    ) { }

    async execute(userId: string, symbol?: string): Promise<PendingOrderResponseDTO[]> {
        const orders = await this._orderRepository.findPendingLimitOrdersByUserId(userId, symbol);

        return orders.map(order => ({
            id: order.id,
            userId: order.userId,
            symbol: order.symbol,
            side: order.side,
            orderType: order.orderType,
            quantity: order.quantity,
            price: order.price,
            limitPrice: order.limitPrice,
            status: order.status,
            filledQty: order.filledQty,
            executedPrice: order.executedPrice,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
            isAlgoTrade: order.isAlgoTrade,
        }));
    }

}
