import type { CreateUserDTO } from "@application/dto/auth/create-user.dto";
import type { UserDTO } from "@application/dto/user/user-dto";
import type { KycEntity } from "@domain/entities/kyc.entity";
import { UserEntity } from "@domain/entities/user.entity";
import { SubscripionPlan } from "@domain/enum/users/subscription-plan.enum";

// Dto => Domain
export function toEntity(
  dto: CreateUserDTO,
  hashedPassword: string,
): UserEntity {
  return UserEntity.create({
    fullName: dto.fullName,
    email: dto.email,
    phone: dto.phone,
    password: hashedPassword,
    role: dto.role,
  });
}

export function toUserResponse(
  entity: UserEntity,
  kycDetails?: KycEntity,
): UserDTO {
  return {
    id: entity.id as string,
    userCode: entity.userCode,
    fullName: entity.fullName,
    email: entity.email,
    phone: entity.phone,
    role: entity.role,
    authProvider: entity.authProvider ?? null,
    kycStatus: kycDetails?.status,
    walletBalance: entity.walletBalance ?? 0,
    subscriptionPlan: entity.subscriptionPlan ?? null,
    walletId: entity.walletId ?? null,
    kycId: kycDetails?.id ?? null,
    avatar: entity.avatar ?? null,
    googleId: entity.googleId ?? null,
    isEmailVerified: entity.isEmailVerified ?? false,
    isVerified: entity.isVerified ?? false,
    isBlocked: entity.isBlocked ?? false,
    subscriptionStatus: entity.subscriptionStatus ?? SubscripionPlan.FREE,
    createdAt: (entity.createdAt?.toLocaleDateString() as string) ?? null,
    panNumber: kycDetails?.panNumber ?? null,
    aadhaarNumber: kycDetails?.adhaarNumber ?? null,
    address: kycDetails?.address
      ? {
          fullAddress: kycDetails.address.fullAddress,
          city: kycDetails.address.city,
          state: kycDetails.address.state,
          pinCode: kycDetails.address.pincode,
        }
      : {
          fullAddress: "",
          city: "",
          state: "",
          pinCode: "",
        },
  };
}
