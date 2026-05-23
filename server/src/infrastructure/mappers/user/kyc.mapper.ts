import { KycEntity } from "@domain/entities/user/kyc.entity";
import type { KycStatusType } from "@domain/enum/users/kyc-status.enum";
import { KycDocument } from "@infrastructure/databases/mongo_db/models/schemas/user/kyc.schema";

// Convert MongoDb -> Domain
export const toDomain = (doc: KycDocument): KycEntity => {
  return KycEntity.reconstitute({
    id: doc.id,
    userId: doc.userId as string,
    documents: doc.documents,
    address: doc.address,
    panNumber: doc.panNumber as string,
    aadharNumber: doc.aadharNumber as string,
    isKycVerified: doc.isKycVerified,
    status: doc.status,
    rejectionReason: doc.rejectionReason as string,
    createdAt: doc.createdAt,
  });
};

export const toPersistance = (data: KycEntity): Partial<KycDocument> => {
  return {
    userId: data.userId,
    documents:
      data.documents?.map((doc) => ({
        type: doc.type,
        fileName: doc.fileName,
        fileUrl: doc.fileUrl,
      })) ?? [],

    address: data.address
      ? {
        fullAddress: data.address.fullAddress,
        city: data.address.city,
        state: data.address.state,
        pincode: data.address.pincode,
      }
      : undefined,

    panNumber: data.panNumber ?? null,
    aadharNumber: data.aadharNumber ?? null,
    isKycVerified: data.isKycVerified,
    status: data.status as KycStatusType,
    rejectionReason: data.rejectionReason ?? null,
  };
};

export const KycMapper = {
  toDomain,
  toPersistance,
};
