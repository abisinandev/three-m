import { OrderEntity } from "@domain/entities/stock/order.entity";
import { BaseRepository } from "../base.repository";
import { OrderDocument, OrderModel } from "@infrastructure/databases/mongo_db/models/schemas/stock/order.schema";
import { IOrderRepository } from "@application/interfaces/repositories/stock/order-repository.interface";
import { OrderMapper } from "@infrastructure/mappers/stock/order.mapper";
import { ClientSession } from "mongoose";
import { OrderStatus } from "@domain/entities/stock/enum/order-status.enum";
import { OrderSide } from "@domain/entities/stock/enum/order-side.enum";

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

    async findPendingLimitOrders(): Promise<OrderEntity[]> {
        const docs = await this.model.find({
            status: OrderStatus.PENDING,
            orderType: "LIMIT_ORDER"
        }).exec();

        return Promise.all(docs.map(doc => this.mapper.toDomain(doc)));
    }

    async findPendingLimitOrdersByUserId(userId: string, symbol?: string): Promise<OrderEntity[]> {
        const query: Record<string, unknown> = {
            userId,
            status: OrderStatus.PENDING,
            orderType: "LIMIT_ORDER"
        };
        if (symbol) query.symbol = symbol;

        const docs = await this.model.find(query).sort({ createdAt: -1 }).exec();
        return Promise.all(docs.map(doc => this.mapper.toDomain(doc)));
    }

    async findFilledOrders(): Promise<OrderEntity[] | null> {
        const docs = await this.model.find({
            status: OrderStatus.FILLED,
            side: OrderSide.BUY,
            $or: [
                { stopLoss: { $gt: 0 } },
                { takeProfit: { $gt: 0 } }
            ]
        });
        if (!docs) return null
        return docs.map(doc => this.mapper.toDomain(doc));
    }
}
