import { CurrencyTypes } from "@domain/enum/users/currency-enum";
import { WalletStatus } from "@domain/enum/wallet/wallet-status.enum";

export interface UserWalletDTO {
    id: string;
    userId: string | null;
    currency: CurrencyTypes;
    balance: number;
    status: WalletStatus;
    isVerified: boolean;
    createdAt: string | null;
    updatedAt: string | null;
}