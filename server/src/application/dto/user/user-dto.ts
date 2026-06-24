import { KycStatusType } from "@domain/enum/users/kyc-status.enum";

export type UserDTO = {
  userCode: string;
  fullName: string;
  email: string;
  phone: string | null;

  role: string;
  authProvider: string;

  isVerified: boolean;
  isBlocked: boolean;

  isSubscribed: boolean;
  isTwoFactorEnabled: boolean;
  isAlgoEnabled: boolean;

  subscription: {
    status: string;
    plan: string;
  };
  kycId: string;
  kycStatus?: KycStatusType;
  walletId: string;

  currency: string;

  avatar: string | null;
  googleId: string | null;

  createdAt: string;
};
