import { TransactionResponseDTO } from "./transaction-response.dto";

export interface WalletResponseDTO {
    balance: number;
    currency: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    transactions: TransactionResponseDTO[];
}