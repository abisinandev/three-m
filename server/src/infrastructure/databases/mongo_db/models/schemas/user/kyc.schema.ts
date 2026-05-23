import { model, Schema, Types, Document } from "mongoose";
import { KycStatusType } from "@domain/enum/users/kyc-status.enum";
import { IKycSchema } from "../../interfaces/user/kyc.schema.interface";

export type KycDocument = Document & IKycSchema;

const DocumentSchema = new Schema(
  {
    type: { type: String, required: true, trim: true },
    fileName: { type: String, required: true },
    fileUrl: { type: String, required: true },
  },
  { _id: false }  
);

const AddressSchema = new Schema(
  {
    fullAddress: { type: String, trim: true, required: true },
    city: { type: String, trim: true, required: true },
    state: { type: String, trim: true, required: true },
    pincode: { type: String, trim: true, required: true },
  },
  { _id: false }
);

const KycSchema = new Schema<KycDocument>(
  {
    userId: { type: Types.ObjectId, ref: "User", required: true, unique: true, index: true },
    documents: { type: [DocumentSchema], default: [] },
    status: { type: String, enum: Object.values(KycStatusType), default: KycStatusType.PENDING, index: true },
    isKycVerified: { type: Boolean, default: false },
    panNumber: { type: String, trim: true, uppercase: true, sparse: true, default: null },
    aadharNumber: { type: String, trim: true, sparse: true, default: null },
    address: { type: AddressSchema, required: true },
    rejectionReason: { type: String, trim: true, default: null },
  },
  { timestamps: true, versionKey: false }
);

export const KycModel = model<KycDocument>("KycDetails", KycSchema);
