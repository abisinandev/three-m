import type { CreateUserDTO } from "@application/dto/auth/create-user.dto";
import type { UserDTO } from "@application/dto/user/user-dto";
import { UserEntity } from "@domain/entities/user/user.entity";
import { Role } from "@domain/enum/users/user-role.enum";
import type { UserMeResponseDTO } from "@application/dto/user/user-me-response.dto";
import type { KycEntity } from "@domain/entities/user/kyc.entity";
import type { WalletEntity } from "@domain/entities/user/wallet.entity";
import { maskSensitiveData } from "@shared/utils/masking";
import { IdProtector } from "@shared/utils/id-protector.util";

// Dto => Domain
export function toEntity(dto: CreateUserDTO, hashedPassword: string): UserEntity {
  return UserEntity.create({
    fullName: dto.fullName,
    email: dto.email,
    phone: dto.phone,
    password: hashedPassword,
    role: Role.USER,
  });
}

export function toUserResponse(user: UserEntity): UserDTO {

  return {
    userCode: user.userCode,
    fullName: user.fullName,
    email: user.email,
    phone: user.phone ?? null,

    role: user.role,
    authProvider: user.authProvider,

    isVerified: user.isVerified,
    isBlocked: user.isBlocked,

    isSubscribed: user.isSubscribed,
    isTwoFactorEnabled: user.isTwoFactorEnabled,
    isAlgoEnabled: user.isAlgoEnabled,

    subscription: {
      status: user.subscriptionStatus,
      plan: user.subscriptionPlan,
    },

    kycStatus: user.kycStatus,

    currency: user.currency,
    avatar: user.avatar ?? null,


    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export function toUserMeResponse(
  user: UserEntity,
  kyc?: KycEntity | null,
  wallet?: WalletEntity | null
): UserMeResponseDTO {
  const userDto = toUserResponse(user);

  return {
    ...userDto,
    kyc: kyc
      ? {

        status: kyc.status,
        panNumber: maskSensitiveData(kyc.panNumber),
        aadharNumber: maskSensitiveData(kyc.aadharNumber),
        address: kyc.address
          ? {
            fullAddress: kyc.address.fullAddress,
            city: kyc.address.city,
            state: kyc.address.state,
            pinCode: kyc.address.pincode,
          }
          : undefined,
        rejectionReason: kyc.rejectionReason ?? null,
      }
      : undefined,
    wallet: wallet
      ? {

        balance: wallet.balance,
        currency: wallet.currency,
        status: wallet.status,
        createdAt: wallet.createdAt,
        updatedAt: wallet.updatedAt,
      }
      : undefined,
  };
}

