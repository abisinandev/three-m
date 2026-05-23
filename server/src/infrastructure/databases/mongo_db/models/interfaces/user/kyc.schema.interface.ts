import type { KycStatusType } from "@domain/enum/users/kyc-status.enum";
import { Types } from "mongoose";

export interface IKycSchema {
  _id: Types.ObjectId;  
  userId: string | null; 
  documents: {
    type: string;
    fileName: string;
    fileUrl: string;
  }[];
  status: KycStatusType;
  isKycVerified: boolean;
  panNumber?: string | null;
  aadharNumber?: string | null;
  address: {
    fullAddress: string;
    city: string;
    state: string;
    pincode: string;
  };
  rejectionReason?: string | null;
  createdAt?: Date;  
  updatedAt?: Date; 
}
