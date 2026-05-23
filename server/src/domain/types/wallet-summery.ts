import { WalletStatus } from "@domain/enum/wallet/wallet-status.enum";

export type WalletSummary = {
    id: string;
    balance: number;
    currency: string;
    status: WalletStatus;
    createdAt: Date;
    updatedAt: Date;
};