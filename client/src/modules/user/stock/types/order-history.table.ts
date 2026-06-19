import { OrderHistoryItem } from "@/shared/services/stock/fetch-stocks-api";

export interface OrderHistoryTableProps {
    orders: OrderHistoryItem[];
    total: number;
    page: number;
    limit: number;
    onPageChange: (page: number) => void;
    isLoading: boolean;
    onNavigate: (symbol: string) => void;
}
