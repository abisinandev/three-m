import type { Types } from "mongoose";
import type { AuthProvider } from "@domain/enum/users/auth-provider.enum";
import type { CurrencyTypes } from "@domain/enum/users/currency-enum";
import type { KycStatusType } from "@domain/enum/users/kyc-status.enum";
import type { SubscripionPlan } from "@domain/enum/users/subscription-plan.enum";
import type { SubscriptionStatus } from "@domain/enum/users/subscription-status.enum";
import type { Role } from "@domain/enum/users/user-role.enum";
import { KycDocument } from "../../schemas/user/kyc.schema";
import { WalletDocument } from "../../schemas/user/wallet.schema";


export interface IUserSchema {
  _id: Types.ObjectId;

  userCode: string;
  fullName: string;
  email: string;

  phone: string | null;
  password: string | null;

  role: Role;

  isVerified: boolean;
  isEmailVerified: boolean;
  isBlocked: boolean;

  kycId: Types.ObjectId | KycDocument | null;
  kycStatus: KycStatusType;

  walletId: Types.ObjectId | WalletDocument | null;
  currency: CurrencyTypes;

  subscriptionId: Types.ObjectId | null;
  subscriptionStatus: SubscriptionStatus;
  subscriptionPlan: SubscripionPlan;

  isTwoFactorEnabled: boolean;
  twoFactorSecret: string | null;
  qrCodeUrl: string | null;

  isAlgoEnabled: boolean;

  authProvider: AuthProvider;
  avatar: string | null;
  googleId: string | null;

  createdAt: Date;
  updatedAt: Date;
}
