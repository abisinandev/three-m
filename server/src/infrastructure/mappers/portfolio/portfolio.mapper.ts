import { PortfolioEntity } from "@domain/entities/portfolio/portfolio.entity";
import { PortfolioDocument } from "@infrastructure/databases/mongo_db/models/schemas/portfolio/portfolio.schema";

export const toDomain = (doc: PortfolioDocument): PortfolioEntity => {
    return PortfolioEntity.fromPersistence({
        id: doc._id?.toString(),
        userId: doc.userId?.toString(),
        symbol: doc.symbol,
        quantity: doc.quantity,
        avgPrice: doc.avgPrice,
        investedAmount: doc.investedAmount,
        lockQty: doc.lockQty || 0,
        createdAt: doc.createdAt as Date,
        updatedAt: doc.updatedAt as Date,
    });
};

export const toPersistance = (entity: PortfolioEntity): Partial<PortfolioDocument> => {
    const persistence = entity.toPersistence();
    return {
        userId: persistence.userId as any,
        symbol: persistence.symbol,
        quantity: persistence.quantity,
        avgPrice: persistence.avgPrice,
        investedAmount: persistence.investedAmount,
        lockQty: persistence.lockQty,
        createdAt: persistence.createdAt,
        updatedAt: new Date(),
    };
};

export const PortfolioMapper = {
    toDomain,
    toPersistance,
};
