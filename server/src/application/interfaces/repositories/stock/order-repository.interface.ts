import { OrderEntity } from "@domain/entities/stock/order.entity";
import { IBaseRepository } from "../base-repository.interface";
import { ClientSession } from "mongoose";

export interface IOrderRepository extends IBaseRepository<OrderEntity> {
    create(entity: OrderEntity, session?: ClientSession): Promise<OrderEntity>;
    countCancelledOrders(): Promise<number>;
}