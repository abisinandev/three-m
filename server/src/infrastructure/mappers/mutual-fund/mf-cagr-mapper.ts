import { MfCagrEntity } from "@domain/entities/mutual-fund/cagr-entity";
import { MfCAGRDocument } from "@infrastructure/databases/mongo_db/models/interfaces/mutual-fund/cagr.schema.interface";

/**
 * Convert Mongo document → Domain entity
 */
const toDomain = (doc: MfCAGRDocument): MfCagrEntity => {
    return MfCagrEntity.fromPersistance({
        id: doc.id.toString(),
        schemeCode: doc.schemeCode,
        cagr1Y: doc.cagr1Y,
        cagr3Y: doc.cagr3Y,
        cagr5Y: doc.cagr5Y,
        updatedAt: doc.updatedAt,
    });
};

/**
 * Convert Domain entity → Mongo persistence object
 */
const toPersistance = (
    entity: MfCagrEntity
): Partial<MfCAGRDocument> => {
    return {
        schemeCode: entity.schemeCode,
        cagr1Y: entity.cagr1Y,
        cagr3Y: entity.cagr3Y,
        cagr5Y: entity.cagr5Y,
        updatedAt: entity.updatedAt,
    };
};

export const MfCagrMapper = {
    toDomain,
    toPersistance,
};
