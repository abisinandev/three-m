export interface AdminTradeResponseDTO {
    userCode: string;
    orderId: string;
    symbol: string;
    side: string;
    quantity: number;
    price: number;
    profit?: number;
    isAlgoTrade: boolean;
    createdAt: Date;
}
