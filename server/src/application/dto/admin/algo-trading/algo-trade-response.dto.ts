export interface AdminAlgoTradeResponseDTO {
    symbol: string;
    side: string;
    quantity: number;
    price: number;
    profit?: number;
    createdAt: Date;
}
