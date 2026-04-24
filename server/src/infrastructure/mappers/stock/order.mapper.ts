import { OrderStatus } from "@domain/entities/stock/enum/order-status.enum";
import { OrderEntity } from "@domain/entities/stock/order.entity";
import { OrderDocument } from "@infrastructure/databases/mongo_db/models/schemas/stock/order.schema";

const toDomain = (doc: OrderDocument): OrderEntity => {
    return OrderEntity.fromPersistence({
        id: doc._id?.toString(),
        userId: doc.userId,
        symbol: doc.symbol,
        side: doc.side,
        orderType: doc.orderType,
        quantity: doc.quantity,
        price: doc.price as number,
        limitPrice: doc.limitPrice ?? null,
        status: doc.status as OrderStatus,
        filledQty: doc.filledQty,
        executedPrice: doc.executedPrice ?? null,

        stopLoss: doc.stopLoss ?? null,
        takeProfit: doc.takeProfit ?? null,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
        executedAt: doc.executedAt ?? null,
        isAlgoTrade: doc.isAlgoTrade ?? false,
    });
};

const toPersistance = (entity: OrderEntity): Partial<OrderDocument> => {
    return {
        userId: entity.userId,
        symbol: entity.symbol,
        side: entity.side,
        orderType: entity.orderType,
        quantity: entity.quantity,
        price: entity.price ?? undefined,
        limitPrice: entity.limitPrice ?? undefined,
        status: entity.status,
        filledQty: entity.filledQty,
        executedPrice: entity.executedPrice ?? undefined,
        executedAt: entity.executedAt ?? undefined,

        stopLoss: entity.stopLoss,
        takeProfit: entity.takeProfit,
        createdAt: entity.createdAt,
        updatedAt: new Date(),
        isAlgoTrade: entity.isAlgoTrade,
    };
};

export const OrderMapper = {
    toDomain,
    toPersistance,
}