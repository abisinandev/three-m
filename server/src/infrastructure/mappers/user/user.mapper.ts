import { UserEntity } from "@domain/entities/user/user.entity";
import { CurrencyTypes } from "@domain/enum/users/currency-enum";
import { KycStatusType } from "@domain/enum/users/kyc-status.enum";
import { SubscriptionStatus } from "@domain/enum/users/subscription-status.enum";
import { KycSummary } from "@domain/types/kyc-summery";
import { WalletSummary } from "@domain/types/wallet-summery";
import type { UserDocument } from "@infrastructure/databases/mongo_db/models/schemas/user/user.schema";
import { Types } from "mongoose";


// Convert MongoDb -> Domain
export const toDomain = (userDoc: UserDocument): UserEntity => {

  let walletId: string | null = null;
  let wallet: WalletSummary | null = null;

  if (userDoc.walletId) {
    if (typeof userDoc.walletId === "object" && !(userDoc.walletId instanceof Types.ObjectId)) {
      walletId = userDoc.walletId._id.toString();
      wallet = {
        id: userDoc.walletId._id.toString(),
        balance: userDoc.walletId.balance,
        currency: userDoc.walletId.currency,
        status: userDoc.walletId.status,
        createdAt: userDoc.walletId.createdAt ?? new Date(0),
        updatedAt: userDoc.updatedAt ?? new Date(0),
      };
    } else {
      walletId = userDoc.walletId.toString();
    }
  }

  let kycId: string | null = null;
  let kyc: KycSummary | null = null;

  if (userDoc.kycId) {
    if (typeof userDoc.kycId === 'object' && !(userDoc.kycId instanceof Types.ObjectId)) {
      kycId = userDoc.kycId._id.toString();
      kyc = {
        id: userDoc.kycId._id.toString(),
        status: userDoc.kycId.status,
        panNumber: userDoc.kycId.panNumber as string,
        aadhaarNumber: userDoc.kycId.aadhaarNumber as string,
        address: {
          city: userDoc.kycId.address.city,
          fullAddress: userDoc.kycId.address.fullAddress,
          pinCode: userDoc.kycId.address.pincode,
          state: userDoc.kycId.address.state
        }
      }
    } else {
      kycId = userDoc.kycId.toString();
    }
  }

  

  return UserEntity.reconstitute({
    id: userDoc._id.toString(),
    userCode: userDoc.userCode,
    fullName: userDoc.fullName,
    email: userDoc.email,
    phone: userDoc.phone,
    password: userDoc.password,
    role: userDoc.role,
    isEmailVerified: userDoc.isEmailVerified,
    isVerified: userDoc.isVerified,
    isBlocked: userDoc.isBlocked,
    subscriptionStatus: userDoc.subscriptionStatus ?? SubscriptionStatus.INACTIVE,
    subscriptionPlan: userDoc.subscriptionPlan,
    currency: userDoc.currency ?? CurrencyTypes.INR,
    kycId,
    kyc,
    kycStatus: userDoc.kycStatus ?? KycStatusType.NULL,
    walletId,
    wallet,
    isTwoFactorEnabled: userDoc.isTwoFactorEnabled ?? false,
    twoFactorSecret: userDoc.twoFactorSecret,
    qrCodeUrl: userDoc.qrCodeUrl,
    createdAt: userDoc.createdAt,
    authProvider: userDoc.authProvider,
    avatar: userDoc.avatar,
    googleId: userDoc.googleId,
    updatedAt: userDoc.updatedAt,
  });
};

// Convert Domain -> MongoDb
export const toPersistance = (user: UserEntity): Partial<UserDocument> => {
  const toObjectId = (id?: string | null) =>
    id ? new Types.ObjectId(id) : undefined;

  return {
    userCode: user.userCode,
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
    password: user.password,
    role: user.role,
    isEmailVerified: user.isEmailVerified,
    isVerified: user.isVerified,
    isBlocked: user.isBlocked,
    subscriptionStatus: user.subscriptionStatus,
    subscriptionPlan: user.subscriptionPlan,
    currency: user.currency,
    kycId: toObjectId(user.kycId),
    kycStatus: user.kycStatus,
    walletId: toObjectId(user.walletId),
    isTwoFactorEnabled: user.isTwoFactorEnabled,
    twoFactorSecret: user.twoFactorSecret,
    qrCodeUrl: user.qrCodeUrl,
    authProvider: user.authProvider,
    avatar: user.avatar,
    googleId: user.googleId,
  };
};

export const UserMapper = {
  toDomain,
  toPersistance,
};
