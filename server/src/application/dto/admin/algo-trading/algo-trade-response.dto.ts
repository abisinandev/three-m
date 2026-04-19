export interface AdminAlgoTradeResponseDTO {
    id: string;
    userId: string;
    orderId: string;
    symbol: string;
    side: string;
    quantity: number;
    price: number;
    profit?: number;
    createdAt: Date;
}
