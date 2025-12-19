import { WalletStatus } from "@domain/enum/wallet/wallet-status.enum";

export type WalletSummary = {
    id: string;
    balance: number;
    currency: string;
    isVerified: boolean;
    status: WalletStatus;
    createdAt: Date;
    updatedAt: Date;
};