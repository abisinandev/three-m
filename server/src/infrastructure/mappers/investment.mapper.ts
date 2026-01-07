import { InvestmentEntity } from "@domain/entities/investment.entity";
import { InvestmentDocument } from "@infrastructure/databases/mongo_db/models/interfaces/investment.schema.interface";
import { Types } from "mongoose";

const toDomain = (doc: InvestmentDocument): InvestmentEntity => {
    return InvestmentEntity.fromPersistance({
        id: doc.id.toString(),
        schemeCode: doc.schemeCode,
        amount: doc.amount,
        status: doc.status,
        nav: doc.nav,
        navDate: doc.navDate,
        type: doc.type,
        units: doc.units,
        createdAt: doc.createdAt,
        userId: doc.userId.toString(),
        updatedAt: doc.updatedAt
    })
}

const toPersistance = (data: InvestmentEntity): Partial<InvestmentDocument> => {
    return {
        schemeCode: data.schemeCode,
        amount: data.amount,
        status: data.status,
        units: data.units,
        nav: data.nav,
        navDate: data.navDate,
        type: data.type,
        userId: new Types.ObjectId(data.userId),
    }
}

export const InvestmentMapper = {
    toDomain,
    toPersistance
}