import { TradeEntity } from "@domain/entities/stock/trade.entity";
import { TradeDocument } from "@infrastructure/databases/mongo_db/models/schemas/stock/trade.schema";
import { OrderSide } from "@domain/entities/stock/enum/order-side.enum";

const toDomain = (doc: TradeDocument): TradeEntity => {
    return TradeEntity.fromPersistence({
        id: doc._id?.toString(),
        orderId: doc.orderId,
        userId: doc.userId,
        symbol: doc.symbol,
        side: doc.side as OrderSide,
        quantity: doc.quantity,
        price: doc.price,
        createdAt: (doc as any).createdAt,
        updatedAt: (doc as any).updatedAt,
    });
};

const toPersistance = (entity: TradeEntity): Partial<TradeDocument> => {
    return {
        orderId: entity.orderId,
        userId: entity.userId,
        symbol: entity.symbol,
        side: entity.side,
        quantity: entity.quantity,
        price: entity.price,
        createdAt: entity.createdAt,
        updatedAt: new Date(),
    };
};

export const TradeMapper = {
    toDomain,
    toPersistance,
}
