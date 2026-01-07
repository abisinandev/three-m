export class Cagr {
    private constructor(private readonly _value: number) { }

    static calculate(
        startNav: number,
        endNav: number,
        years: number
    ): Cagr {
        if (startNav <= 0 || endNav <= 0 || years <= 0) {
            throw new Error("Invalid CAGR inputs");
        }

        const value = (endNav / startNav) ** (1 / years) - 1;

        return new Cagr(value * 100);
    }

    get value(): number {
        return +this._value.toFixed(2);
    }
}
