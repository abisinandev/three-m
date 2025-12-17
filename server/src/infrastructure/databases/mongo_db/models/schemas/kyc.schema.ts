import { model, Schema, Types } from "mongoose";
import { KycStatusType } from "@domain/enum/users/kyc-status.enum";
import type { IKycSchema } from "../interfaces/kyc.schema.interface";

export type KycDocument = IKycSchema & Document;

const KycSchema = new Schema<KycDocument>(
  {
    userId: {
      type: Types.ObjectId,
      required: true,
      index: true,
      unique: true,
    },

    documents: [
      {
        type: {
          type: String,
          required: true,
          trim: true,
        },
        fileName: {
          type: String,
          required: true,
        },
        fileUrl: {
          type: String,
          required: true,
        },
      },
    ],

    status: {
      type: String,
      enum: Object.values(KycStatusType),
      default: KycStatusType.PENDING,
      index: true,
    },

    isKycVerified: {
      type: Boolean,
      default: false,
    },

    panNumber: {
      type: String,
      trim: true,
      uppercase: true,
      sparse: true,
    },

    adhaarNumber: {
      type: String,
      trim: true,
      sparse: true,
    },

    address: {
      fullAddress: { type: String, trim: true },
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      pincode: { type: String, trim: true },
    },

    rejectionReason: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const KycModel = model<KycDocument>("KycDetails", KycSchema);
