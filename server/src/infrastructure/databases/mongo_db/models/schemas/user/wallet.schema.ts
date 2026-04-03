import { Document, Schema, model } from "mongoose";
import { CurrencyTypes } from "@domain/enum/users/currency-enum";
import { WalletStatus } from "@domain/enum/wallet/wallet-status.enum";
import { IWalletSchema } from "../../interfaces/user/wallet.schema.interface";

export type WalletDocument = IWalletSchema & Document;

const WalletSchema = new Schema<WalletDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
      index: true,
    },

    balance: {
      type: Number,
      required: true,
      min: 0,
      max: 1_00000,
    },
    lockedBalance: {
      type: Number,
      min: 0,
    },
    currency: {
      type: String,
      enum: Object.values(CurrencyTypes),
      required: true,
    },

    status: {
      type: String,
      enum: Object.values(WalletStatus),
      default: WalletStatus.ACTIVE,
    },

  },
  { timestamps: true }
);

WalletSchema.index({ userId: 1, currency: 1 }, { unique: true });
export const WalletModel = model<WalletDocument>("Wallet", WalletSchema);
