import type { KycResponseDTO } from "@application/dto/user/kyc-response.dto";
import type { KycSubmitDTO } from "@application/dto/user/kyc-submit.dto";
import { KycEntity } from "@domain/entities/user/kyc.entity";
import type { UserEntity } from "@domain/entities/user/user.entity";

export const toEntity = (userId: string, dto: KycSubmitDTO): KycEntity => {
  return KycEntity.create({
    userId,
    panNumber: dto.panNumber,
    documents: dto.documents,
    aadharNumber: dto.aadharNumber,
    address: dto.address,
  });
};

export const toKycResponse = (data: KycEntity, user: UserEntity): KycResponseDTO => {
  return {
    id: data.id,
    userId: data.userId,
    userCode: user.userCode,
    email: user.email,
    fullName: user.fullName,
    isKycVerified: data.isKycVerified,
    panNumber: data.panNumber as string,
    aadharNumber: data.aadharNumber as string,
    address: data.address ?? {
      fullAddress: "",
      city: "",
      state: "",
      pincode: "",
    },
    documents: Array.isArray(data.documents) ? data.documents : [],
    status: data.status,
    createdAt: (data.createdAt as Date) ?? null,
  };
};
