import { KycStatusType } from "@domain/enum/users/kyc-status.enum";

export interface UserDTO {
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
  kycStatus?: KycStatusType;


  currency: string;

  avatar: string | null;


  createdAt: Date;
  updatedAt: Date;
};
