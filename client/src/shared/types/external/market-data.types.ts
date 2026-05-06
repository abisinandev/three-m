export interface MarketDataCandles {
    s: 'ok' | 'no_data';
    t: number[];
    o: number[];
    h: number[];
    l: number[];
    c: number[];
    v: number[];
}
