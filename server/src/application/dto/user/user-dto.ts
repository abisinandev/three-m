import { KycStatusType } from "@domain/enum/users/kyc-status.enum";
import { KycSummary } from "@domain/types/kyc-summery";
import { WalletSummary } from "@domain/types/wallet-summery";

export type UserDTO = {
  id: string;
  userCode: string;
  fullName: string;
  email: string;
  phone: string | null;

  role: string;
  authProvider: string;

  isEmailVerified: boolean;
  isVerified: boolean;
  isBlocked: boolean;

  subscription: {
    status: string;
    plan: string;
  };
  kycId: string;
  kyc?: KycSummary;
  kycStatus?: KycStatusType;
  wallet?: WalletSummary;
  walletId: string;

  avatar: string | null;
  googleId: string | null;

  createdAt: string;
};
