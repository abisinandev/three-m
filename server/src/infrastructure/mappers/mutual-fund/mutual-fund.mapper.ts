import { MutualFundEntity } from "@domain/entities/mutual-fund/mutual-fund-entity";
import { MutualFundDocument } from "@infrastructure/databases/mongo_db/models/interfaces/mutual-fund/mutual-fund-schema.interface";

export const toDomain = (doc: MutualFundDocument): MutualFundEntity => {
    return MutualFundEntity.fromPersistance({
        id: doc._id.toString(),
        schemeCode: doc.schemeCode,
        schemeName: doc.schemeName,
        source: doc.source,
        amc: doc.amc,
        category: doc.category,
        subCategory: doc.subCategory,
        risk: doc.risk,
        status: doc.status,
        logo: doc.logo,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
    });
}


export const toPersistance = (data: MutualFundEntity): Partial<MutualFundDocument> => {
    return {
        schemeCode: data.schemeCode,
        schemeName: data.schemeName,
        source: data.source,
        amc: data.amc,
        category: data.category,
        subCategory: data.subCategory,
        risk: data.risk,
        status: data.status,
        logo: data.logo,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt
    }
}

export const MutualFundMapper = {
    toDomain,
    toPersistance,
}