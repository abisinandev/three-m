export interface Stock {
    _id: string;
    symbol: string;
    name: string;
    exchange: string;
    sector: string;
    logo?: string | null;
    isTradable: boolean;
    isTracked: boolean;
    isVisible: boolean;
    price?: number;
    createdAt?: string;
    updatedAt?: string;
}


export interface IStockTableProps {
    stocks: Stock[];
    isLoading: boolean;
    isError?: boolean;
    onStatusToggle: (symbol: string, statusKey: 'isTradable' | 'isTracked' | 'isVisible', newValue: boolean) => void;
}
