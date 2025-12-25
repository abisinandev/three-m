import { TransactionResponseDTO } from "./transaction-response.dto";

export interface WalletResponseDTO {
    id: string;
    userId: string;
    balance: number;
    currency: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    transactions: TransactionResponseDTO[];
}