import { SubscriptionStatus } from "@domain/entities/subscription/enums/subscription-status.enums";
import { UserEntity } from "@domain/entities/user/user.entity";
import { CurrencyTypes } from "@domain/enum/users/currency-enum";
import { KycStatusType } from "@domain/enum/users/kyc-status.enum";
import type { UserDocument } from "@infrastructure/databases/mongo_db/models/schemas/user/user.schema";
import { Types } from "mongoose";


// Convert MongoDb -> Domain
export const toDomain = (userDoc: UserDocument): UserEntity => {

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
    subscriptionStatus: userDoc.subscriptionStatus ?? SubscriptionStatus.ACTIVE,
    subscriptionPlan: userDoc.subscriptionPlan,
    subscriptionId: userDoc?.subscriptionId?.toString() ,
    currency: userDoc.currency ?? CurrencyTypes.INR,
    kycId: userDoc.kycId?.toString(),
    kycStatus: userDoc.kycStatus ?? KycStatusType.NULL,
    walletId: userDoc.walletId?.toString(),
    isTwoFactorEnabled: userDoc.isTwoFactorEnabled ?? false,
    twoFactorSecret: userDoc.twoFactorSecret,
    qrCodeUrl: userDoc.qrCodeUrl,
    isAlgoEnabled: userDoc.isAlgoEnabled ?? false,
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
    subscriptionId:toObjectId(user.subscriptionId),
    currency: user.currency,
    kycId: toObjectId(user.kycId),
    kycStatus: user.kycStatus,
    walletId: toObjectId(user.walletId),
    isTwoFactorEnabled: user.isTwoFactorEnabled,
    twoFactorSecret: user.twoFactorSecret,
    qrCodeUrl: user.qrCodeUrl,
    isAlgoEnabled: user.isAlgoEnabled,
    authProvider: user.authProvider,
    avatar: user.avatar,
    googleId: user.googleId,
  };
};

export const UserMapper = {
  toDomain,
  toPersistance,
};
