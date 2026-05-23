import { MutualFundNavEntity } from "@domain/entities/mutual-fund/mutual-fund-nav-entity";
import { MutualFundNavDocument } from "@infrastructure/databases/mongo_db/models/interfaces/mutual-fund/mutual-fund.schema.interface";

const toDomain = (doc: MutualFundNavDocument): MutualFundNavEntity => {
    return MutualFundNavEntity.fromPersistance({
        id: doc._id.toString(),
        nav: doc.nav,
        navDate: doc.navDate,
        schemeCode: doc.schemeCode,
        source: doc.source,
        interval:doc.interval,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
    });
}


const toPersistance = (data: MutualFundNavEntity): Partial<MutualFundNavDocument> => {
    return {
        nav: data.nav,
        navDate: data.navDate,
        schemeCode: data.schemeCode,
        source:data.source,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
    }
}

export const MutualFundNavMapper = {
    toDomain,
    toPersistance
}