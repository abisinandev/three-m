import type { CreateUserDTO } from "@application/dto/auth/create-user.dto";
import type { UserDTO } from "@application/dto/user/user-dto";
import { UserEntity } from "@domain/entities/user/user.entity";
import { Role } from "@domain/enum/users/user-role.enum";

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
    id: user.id as string,
    userCode: user.userCode,
    fullName: user.fullName,
    email: user.email,
    phone: user.phone ?? null,

    role: user.role,
    authProvider: user.authProvider,

    isEmailVerified: user.isEmailVerified,
    isVerified: user.isVerified,
    isBlocked: user.isBlocked,

    isSubscribed: user.isSubscribed,
    isTwoFactorEnabled: user.isTwoFactorEnabled,
    isAlgoEnabled: user.isAlgoEnabled,

    subscription: {
      status: user.subscriptionStatus,
      plan: user.subscriptionPlan,
    },

    walletId: user.walletId as string,
    wallet: user.wallet
      ? {
        id: user.wallet.id,
        balance: user.wallet.balance,
        currency: user.wallet.currency,
        status: user.wallet.status,
        createdAt: user.wallet.createdAt,
        updatedAt: user.wallet.updatedAt,
      }
      : undefined,

    kyc: user.kyc
      ? {
        id: user.kyc.id,
        status: user.kyc.status,
        panNumber: user.kyc.panNumber ?? null,
        aadharNumber: user.kyc.aadharNumber ?? null,
        address: user.kyc.address
          ? {
            fullAddress: user.kyc.address.fullAddress,
            city: user.kyc.address.city,
            state: user.kyc.address.state,
            pinCode: user.kyc.address.pinCode,
          }
          : undefined,
      }
      : undefined,

    kycStatus: user.kycStatus,
    kycId: user.kycId as string,
    currency: user.currency,
    avatar: user.avatar ?? null,
    googleId: user.googleId ?? null,

    createdAt: user.createdAt.toISOString(),
  };
}

