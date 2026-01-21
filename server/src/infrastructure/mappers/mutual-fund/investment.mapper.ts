import { InvestmentEntity } from "@domain/entities/mutual-fund/investment.entity";
import { InvestmentDocument } from "@infrastructure/databases/mongo_db/models/interfaces/mutual-fund/investment.schema.interface";
import { Types } from "mongoose";

const toDomain = (doc: InvestmentDocument): InvestmentEntity => {
    return InvestmentEntity.fromPersistence({
        id: doc._id.toString(),
        schemeCode: doc.schemeCode,
        amount: doc.amount,
        status: doc.status,
        nav: doc.nav,
        navDate: doc.navDate,
        investmentType: doc.investmentType,
        paymentMethod: doc.paymentMethod,
        units: doc.units,
        createdAt: doc.createdAt,
        userId: doc.userId.toString(),
        updatedAt: doc.updatedAt,
        remainingUnits: doc.remainingUnits,
        redeemedAt: doc.redeemedAt,
        sipInstallmentId: doc.sipInstallmentId?.toString(),
        redeemedUnits: doc.redeemedUnits,
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
        userId: new Types.ObjectId(data.userId),
        remainingUnits: data.remainingUnits,
        redeemedUnits: data.redeemedUnits,
        redeemedAt: data.redeemedAt,
        paymentMethod: data.paymentMethod,
        investmentType: data.investmentType,
        sipInstallmentId: new Types.ObjectId(data.sipInstallmentId),
        createdAt: data.createdAt,
    }
}

export const InvestmentMapper = {
    toDomain,
    toPersistance
}