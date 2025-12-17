import type { AuthProvider } from "@domain/enum/users/auth-provider.enum";
import type { CurrencyTypes } from "@domain/enum/users/currency-enum";
import type { KycStatusType } from "@domain/enum/users/kyc-status.enum";
import type { SubscripionPlan } from "@domain/enum/users/subscription-plan.enum";
import type { SubscriptionStatus } from "@domain/enum/users/subscription-status.enum";
import type { Role } from "@domain/enum/users/user-role.enum";

export interface IUserSchema {
  _id: string;
  userCode: string;
  fullName: string;
  email: string;
  phone: string | null;
  password: string | null;
  role: Role;

  isVerified: boolean;
  isEmailVerified: boolean;
  isBlocked: boolean;

  kycId?: string | null;
  kycStatus?: KycStatusType;
  walletId?: string | null;
  walletBalance?: number;
  currency?: CurrencyTypes;

  subscriptionId?: string;
  subscriptionStatus?: SubscriptionStatus;
  subscriptionPlan: SubscripionPlan;

  isTwoFactorEnabled?: boolean;
  twoFactorSecret?: string | null;
  qrCodeUrl?: string | null;
  createdAt?: Date | null;

  authProvider: AuthProvider;
  avatar: string | null;
  googleId: string | null;
}
