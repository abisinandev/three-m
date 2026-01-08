export class Cagr {
    private readonly _value: number;

    private constructor(value: number) {
        this._value = value;
    }

    /**
     * Create CAGR from NAV values (calculation path)
     */
    static calculate(params: {
        startNav: number;
        endNav: number;
        years: number;
    }): Cagr {
        const { startNav, endNav, years } = params;

        if (startNav <= 0) {
            throw new Error("Start NAV must be greater than 0");
        }

        if (endNav <= 0) {
            throw new Error("End NAV must be greater than 0");
        }

        if (years <= 0) {
            throw new Error("Years must be greater than 0");
        }

        const cagr =
            Math.pow(endNav / startNav, 1 / years) - 1;

        return new Cagr(cagr * 100);
    }

    /**
     * Create CAGR from stored percentage (rehydration path)
     * Used when loading from database
     */
    static fromPercentage(value: number): Cagr {
        if (!Number.isFinite(value)) {
            throw new Error("Invalid CAGR value");
        }

        return new Cagr(value);
    }

    /**
     * Get CAGR as percentage
     */
    get value(): number {
        return Number(this._value.toFixed(2));
    }
}
