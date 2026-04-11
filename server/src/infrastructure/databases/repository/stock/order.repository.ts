import { OrderEntity } from "@domain/entities/stock/order.entity";
import { BaseRepository } from "../base.repository";
import { OrderDocument, OrderModel } from "@infrastructure/databases/mongo_db/models/schemas/stock/order.schema";
import { IOrderRepository } from "@application/interfaces/repositories/stock/order-repository.interface";
import { OrderMapper } from "@infrastructure/mappers/stock/order.mapper";
import { ClientSession } from "mongoose";
import { OrderStatus } from "@domain/entities/stock/enum/order-status.enum";

export class OrderRepository extends BaseRepository<OrderEntity, OrderDocument> implements IOrderRepository {

    constructor() {
        super(OrderModel, OrderMapper)
    }

    async create(entity: OrderEntity, session?: ClientSession): Promise<OrderEntity> {
        const data = this.mapper.toPersistance(entity);

        const doc = await this.model.create([data], { session });

        return this.mapper.toDomain(doc[0]);
    }

    async countCancelledOrders(): Promise<number> {
        return this.model.countDocuments({ status: OrderStatus.CANCELLED }).exec();
    }
}