import { OrderEntity } from "@domain/entities/stock/order.entity";
import { IBaseRepository } from "../base-repository.interface";
import { ClientSession } from "mongoose";

export interface IOrderRepository extends IBaseRepository<OrderEntity> {
    create(entity: OrderEntity, session?: ClientSession): Promise<OrderEntity>;
    findPendingLimitOrders(): Promise<OrderEntity[]>;
    findPendingLimitOrdersByUserId(userId: string, symbol?: string): Promise<OrderEntity[]>;
    countCancelledOrders(): Promise<number>;
    findFilledOrders(): Promise<OrderEntity[] | null>;
}
