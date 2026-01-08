import type { KycStatusType } from "@domain/enum/users/kyc-status.enum";
import type { KycDocumentVO } from "@domain/value-objects/user/kyc-documents.vo";

export interface KycResponseDTO {
  id?: string;
  userId: string;
  userCode?: string;
  email?: string;
  fullName?: string;
  isKycVerified?: boolean;
  status: KycStatusType;
  documents: KycDocumentVO[];
  panNumber: string;
  aadhaarNumber: string;
  address: {
    fullAddress: string;
    city: string;
    state: string;
    pincode: string;
  };
  createdAt?: Date | null;
}
