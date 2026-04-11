export interface CandleDTO {
    symbol: string;
    timeframe: string;
    time: number;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
}

export interface CandlesResponseDTO {
    s: 'ok' | 'no_data' | 'error';
    t: number[];
    o: number[];
    h: number[];
    l: number[];
    c: number[];
    v: number[];
}
