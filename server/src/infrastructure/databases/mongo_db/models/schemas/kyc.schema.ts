import { KycStatusType } from "@domain/enum/users/kyc-status.enum";
import { model, Schema } from "mongoose";
import type { IKycSchema } from "../interfaces/kyc.schema.interfaces";

export type KycDocument = Document & IKycSchema;

const KycSchema = new Schema<KycDocument>(
  {
    userId: { type: String },
    documents: [
      {
        type: { type: String },
        fileName: { type: String },
        fileUrl: { type: String },
      },
    ],
    status: { type: String, enum: KycStatusType, default: KycStatusType.NULL },
    isKycVerified: { type: Boolean },
    panNumber: { type: String },
    adhaarNumber: { type: String },
    address: {
      fullAddress: { type: String },
      city: { type: String },
      state: { type: String },
      pincode: { type: String },
    },
    rejectionReason: { type: String },
  },
  { timestamps: true },
);

export const KycModel = model<KycDocument>("KycDetails", KycSchema);
