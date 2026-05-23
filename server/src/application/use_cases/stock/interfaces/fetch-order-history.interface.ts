export interface OrderHistoryItemDTO {
    id: string;
    userId: string;
    symbol: string;
    name: string;
    logo?: string;
    exchange: string;
    side: string;
    orderType: string;
    quantity: number;
    price: number;
    limitPrice: number | null;
    stopLoss: number | null;
    takeProfit: number | null;
    status: string;
    filledQty: number;
    executedPrice: number | null;
    createdAt: Date;
    updatedAt: Date;
    executedAt: Date | null;
    isAlgoTrade: boolean;
}

export interface IFetchOrderHistoryUseCase {
    execute(userId: string, page: number, limit: number): Promise<{ orders: OrderHistoryItemDTO[]; total: number }>;
}
