import { CurrencyTypes } from "@domain/enum/users/currency-enum";
import { WalletStatus } from "@domain/enum/wallet/wallet-status.enum";

export interface IWalletSchema {
    id: string;
    userId: string | null;
    currency: CurrencyTypes;
    balance: number;
    status: WalletStatus;
    isVerified: boolean;
    createdAt: Date | null;
    updatedAt: Date | null;
}