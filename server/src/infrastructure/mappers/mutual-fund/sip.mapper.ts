import { SipEntity } from "@domain/entities/mutual-fund/sip.entity";
import { SipDocument } from "@infrastructure/databases/mongo_db/models/interfaces/mutual-fund/sip.schema.interface";

export const toDomain = (doc: SipDocument): SipEntity => {
    return SipEntity.fromPersistence({
        id: doc._id.toString(),
        userId: doc.userId,
        status: doc.status,
        schemeCode: doc.schemeCode,
        amount: doc.amount,
        frequency: doc.frequency,
        totalInstallments: doc.totalInstallments,
        executedInstallments: doc.executedInstallments,
        nextExecutionDate: doc.nextExecutionDate,
        startDate: doc.startDate,
        updatedAt: doc.updatedAt,
        createdAt: doc.createdAt,
    })
}


export const toPersistance = (data: SipEntity): Partial<SipDocument> => {
    return {
        userId: data.userId,
        schemeCode: data.schemeCode,
        amount: data.amount,
        frequency: data.frequency,
        startDate: data.startDate,
        nextExecutionDate: data.nextExecutionDate,
        totalInstallments: data.totalInstallments,
        executedInstallments: data.executedInstallments,
        status: data.status,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
        
    };
}

export const SipMapper = {
    toDomain,
    toPersistance
}