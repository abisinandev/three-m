import { PortfolioEntity } from "@domain/entities/portfolio/portfolio.entity";
import { PortfolioDocument } from "@infrastructure/databases/mongo_db/models/schemas/portfolio/portfolio.schema";

export const toDomain = (doc: PortfolioDocument): PortfolioEntity => {
    return PortfolioEntity.fromPersistence({
        id: doc._id?.toString(),
        userId: doc.userId?.toString(),
        assetId: doc.assetId?.toString(),
        assetType: doc.assetType,
        quantity: doc.quantity,
        units: doc.units,
        avgPrice: doc.avgPrice,
        investedAmount: doc.investedAmount,
        lockQty: doc.lockQty || 0,
        stopLoss: doc.stopLoss,
        takeProfit: doc.takeProfit,
        createdAt: doc.createdAt as Date,
        updatedAt: doc.updatedAt as Date,
    });
};

export const toPersistance = (entity: PortfolioEntity): Partial<PortfolioDocument> => {
    const data = entity.toPersistence();
    return {
        userId: data.userId as unknown,
        assetId: data.assetId as unknown,
        assetType: data.assetType,
        quantity: data.quantity,
        units: data.units,
        avgPrice: data.avgPrice,
        investedAmount: data.investedAmount,
        lockQty: data.lockQty,
        stopLoss: data.stopLoss,
        takeProfit: data.takeProfit,
        createdAt: data.createdAt,
        updatedAt: new Date(),
    };
};

export const PortfolioMapper = {
    toDomain,
    toPersistance,
};
