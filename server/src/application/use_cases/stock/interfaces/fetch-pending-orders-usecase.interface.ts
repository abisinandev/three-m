import { OrderEntity } from "@domain/entities/stock/order.entity";

export interface IFetchPendingOrdersUseCase {
    execute(userId: string, symbol?: string): Promise<any[]>;

}
