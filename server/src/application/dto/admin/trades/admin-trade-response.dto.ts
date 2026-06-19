export interface AdminTradeResponseDTO {
    id: string;
    userId: string;
    orderId: string;
    symbol: string;
    side: string;
    quantity: number;
    price: number;
    profit?: number;
    isAlgoTrade: boolean;
    createdAt: Date;
}
