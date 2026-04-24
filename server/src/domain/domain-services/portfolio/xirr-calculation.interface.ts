export type CashFlow = {
    date: Date;
    amount: number;
};

export interface IXirrCalculator {
    calculate(cashFlows: CashFlow[]): number | null;
}
