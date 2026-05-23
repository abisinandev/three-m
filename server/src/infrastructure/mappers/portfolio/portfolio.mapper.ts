import { PortfolioEntity } from "@domain/entities/portfolio/portfolio.entity";
import { PortfolioDocument } from "@infrastructure/databases/mongo_db/models/schemas/portfolio/portfolio.schema";
import { Types } from "mongoose";

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
        status: doc.status,
        createdAt: doc.createdAt as Date,
        updatedAt: doc.updatedAt as Date,
    });
};

export const toPersistance = (data: PortfolioEntity): Partial<PortfolioDocument> => {
    return {
        userId: new Types.ObjectId(data.userId),
        assetId: new Types.ObjectId(data.assetId),
        assetType: data.assetType,
        quantity: data.quantity,
        units: data.units,
        avgPrice: data.avgPrice,
        investedAmount: data.investedAmount,
        lockQty: data.lockQty,
        status: data.status,
        createdAt: data.createdAt,
        updatedAt: new Date(),
    };
};

export const PortfolioMapper = {
    toDomain,
    toPersistance,
};
