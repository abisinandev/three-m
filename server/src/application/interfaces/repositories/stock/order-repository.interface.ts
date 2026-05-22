import { OrderEntity } from "@domain/entities/stock/order.entity";
import { IBaseRepository } from "../base-repository.interface";
import { ClientSession } from "mongoose";

export interface IOrderRepository extends IBaseRepository<OrderEntity> {
    createOrder(entity: OrderEntity, session?: ClientSession): Promise<OrderEntity>;
    findPendingLimitOrders(): Promise<OrderEntity[]>;
    findPendingLimitOrdersByUserId(userId: string, symbol?: string): Promise<OrderEntity[]>;
    countCancelledOrders(): Promise<number>;
    findFilledOrders(): Promise<OrderEntity[] | null>;
    findUserAllOrders(userId: string, page: number, limit: number): Promise<{ orders: OrderEntity[]; total: number }>;
}
