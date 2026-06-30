export interface TradeHistoryItem {
    id: string;
    side: string;
    totalAmount: number;
    price: number;
    quantity: number;
    date?: string;
    createdAt?: string;
    assetType?: string;
    assetName?: string;
    symbol?: string;
    assetId?: string;
    orderType?: string;
    exchange?: string;
    productType?: string;
    triggerPrice?: number;
}

export interface TradeHistoryTableProps {
    data: TradeHistoryItem[];
    total: number;
    page: number;
    limit: number;
    onPageChange: (page: number) => void;
    isLoading: boolean;
}
