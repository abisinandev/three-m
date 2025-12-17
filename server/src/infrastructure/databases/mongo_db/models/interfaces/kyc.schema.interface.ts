import type { KycStatusType } from "@domain/enum/users/kyc-status.enum";

export interface IKycSchema {
  id: string;
  userId: string | null;
  documents: {
    type: string;
    fileName: string;
    fileUrl: string;
  }[];
  status: KycStatusType;
  isKycVerified: boolean;
  panNumber: string | null;
  adhaarNumber: string | null;
  address: {
    fullAddress: string;
    city: string;
    state: string;
    pincode: string;
  };
  rejectionReason?: string | null;
  createdAt: Date | null;
}
