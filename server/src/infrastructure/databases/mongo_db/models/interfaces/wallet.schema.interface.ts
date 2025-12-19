import { CurrencyTypes } from "@domain/enum/users/currency-enum";
import { WalletStatus } from "@domain/enum/wallet/wallet-status.enum";
import { Types } from "mongoose";

export interface IWalletSchema {
    _id: Types.ObjectId;
    userId: Types.ObjectId;
    currency: CurrencyTypes;
    balance: number;
    status: WalletStatus;
    isVerified: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}