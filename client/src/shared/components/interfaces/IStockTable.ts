export interface Stock {
    _id: string;
    symbol: string;
    name: string;
    exchange: string;
    sector: string;
    logo?: string | null;
    isTradable: boolean;
    isVisible: boolean;
    price?: number;
    change?: number;
    changePercent?: number;
    history?: number[];
    createdAt?: string;
    updatedAt?: string;
}



export interface IStockTableProps {
    stocks: Stock[];
    isLoading: boolean;
    isError?: boolean;
    onStatusToggle: (symbol: string, statusKey: 'isTradable' | 'isVisible', newValue: boolean) => void;
}
