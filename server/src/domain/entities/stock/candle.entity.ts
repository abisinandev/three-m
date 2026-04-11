export class CandleEntity {
    private readonly _symbol: string;
    private readonly _timeframe: string;
    private readonly _time: number;
    private readonly _open: number;
    private readonly _high: number;
    private readonly _low: number;
    private readonly _close: number;
    private readonly _volume: number;

    private constructor(props: {
        symbol: string;
        timeframe: string;
        time: number;
        open: number;
        high: number;
        low: number;
        close: number;
        volume: number;
    }) {
        this._symbol = props.symbol;
        this._timeframe = props.timeframe;
        this._time = props.time;
        this._open = props.open;
        this._high = props.high;
        this._low = props.low;
        this._close = props.close;
        this._volume = props.volume;
    }

    static create(data: {
        symbol: string;
        timeframe: string;
        time: number;
        open: number;
        high: number;
        low: number;
        close: number;
        volume: number;
    }): CandleEntity {
        return new CandleEntity(data);
    }

    get symbol(): string {
        return this._symbol;
    }

    get timeframe(): string {
        return this._timeframe;
    }

    get time(): number {
        return this._time;
    }

    get open(): number {
        return this._open;
    }

    get high(): number {
        return this._high;
    }

    get low(): number {
        return this._low;
    }

    get close(): number {
        return this._close;
    }

    get volume(): number {
        return this._volume;
    }

    toPersistence() {
        return {
            symbol: this._symbol,
            timeframe: this._timeframe,
            time: this._time,
            open: this._open,
            high: this._high,
            low: this._low,
            close: this._close,
            volume: this._volume,
        };
    }
}
