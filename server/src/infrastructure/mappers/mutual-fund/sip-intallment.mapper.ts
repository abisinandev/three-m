import { SipInstallmentEntity } from "@domain/entities/mutual-fund/sip-intallment.entity";
import { SipInstallmentDocument } from "@infrastructure/databases/mongo_db/models/interfaces/mutual-fund/sip-intallment-schema-interface";
import { Types } from "mongoose";

export const toDomain = (
    doc: SipInstallmentDocument
): SipInstallmentEntity => {
    return SipInstallmentEntity.fromPersistence({
        id: doc._id.toString(),

        sipId: doc.sipId.toString(),
        userId: doc.userId.toString(),
        schemeCode: doc.schemeCode,

        installmentNo: doc.installmentNo,
        executionDate: doc.executionDate,

        amount: doc.amount,

        status: doc.status,

        nav: doc.nav,
        units: doc.units,

        failureReason: doc.failureReason,
        investmentId: doc.investmentId,
        retryCount: doc.retryCount ?? 0,

        createdAt: doc.createdAt,
    });
};

export const toPersistance = (
    data: SipInstallmentEntity
): Partial<SipInstallmentDocument> => {
    return {
        sipId: new Types.ObjectId(data.sipId),
        userId: new Types.ObjectId(data.userId),
        schemeCode: data.schemeCode,

        installmentNo: data.installmentNo,
        executionDate: data.executionDate,

        amount: data.amount,

        status: data.status,

        nav: data.nav,
        units: data.units,

        failureReason: data.failureReason,
        investmentId: data.investmentId,
        retryCount: data.retryCount,

        createdAt: data.createdAt,
    };
};

export const SipInstallmentMapper = {
    toDomain,
    toPersistance,
};
