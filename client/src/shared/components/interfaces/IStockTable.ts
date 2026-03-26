export interface Stock {
    _id: string;
    symbol: string;
    name: string;
    exchange: string;
    sector: string;
    logo?: string;
    isTradable: boolean;
    isTracked: boolean;
    isVisible: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface IStockTableProps {
    stocks: Stock[];
    isLoading: boolean;
    isError?: boolean;
    onStatusToggle: (symbol: string, statusKey: 'isTradable' | 'isTracked' | 'isVisible', newValue: boolean) => void;
}
