import { CashFlow, IXirrCalculator } from "./xirr-calculation.interface";


/**
 * Portfolio XIRR Domain Service
 *
 * Responsible for calculating the overall portfolio return using XIRR
 * (Extended Internal Rate of Return).
 *
 * - Accepts a unified list of cash flows (investments, withdrawals, current value)
 * - Supports multiple asset types (Mutual Funds, Stocks, etc.)
 * - Considers timing of each cash flow for accurate return calculation
 * - Uses an iterative numerical method (Newton-Raphson) to solve XIRR
 *
 * Key Behavior:
 * - Negative values represent investments (cash outflows)
 * - Positive values represent returns or current portfolio value (inflows)
 * - Returns annualized percentage representing true portfolio performance
 *
 * Notes:
 * - Pure domain logic (no external dependencies)
 * - Independent of data source or asset type
 * - Ensures accurate, time-weighted performance measurement
 */

export class PortfolioXirrService implements IXirrCalculator {

    calculate(cashFlows: CashFlow[]): number | null {
        if (!cashFlows || cashFlows.length < 2) return null;

        const cleaned = this.cleanCashFlows(cashFlows);

        if (cleaned.length < 2) return null;

        const firstDate = cleaned[0].date;
        const portfolioAgeDays =
            (Date.now() - firstDate.getTime()) / (1000 * 60 * 60 * 24);

        if (portfolioAgeDays < 7) return null;

        return this.solveXirr(cleaned);
    }


    private cleanCashFlows(cashFlows: CashFlow[]): CashFlow[] {
        const sorted = [...cashFlows].sort(
            (a, b) => a.date.getTime() - b.date.getTime()
        );

        const cleaned: CashFlow[] = [];
        const skip = new Set<number>();

        for (let i = 0; i < sorted.length; i++) {
            if (skip.has(i)) continue;

            const current = sorted[i];

            if (current.amount > 0) {
                for (let j = i + 1; j < sorted.length; j++) {
                    if (skip.has(j)) continue;

                    const candidate = sorted[j];

                    const timeDiff = Math.abs(
                        candidate.date.getTime() - current.date.getTime()
                    );

                    const sameAmount =
                        Math.abs(candidate.amount - current.amount) < 0.01;

                    // remove duplicate positive cashflows
                    if (
                        timeDiff <= 1000 &&
                        candidate.amount > 0 &&
                        sameAmount
                    ) {
                        skip.add(j);
                    }
                }
            }

            cleaned.push(current);
            skip.add(i);
        }

        return cleaned;
    }


    private solveXirr(cashFlows: CashFlow[]): number | null {
        const hasPositive = cashFlows.some(c => c.amount > 0);
        const hasNegative = cashFlows.some(c => c.amount < 0);

        if (!hasPositive || !hasNegative) return null;

        const firstDate = cashFlows[0].date;

        let rate = 0.1;
        const tolerance = 1e-7;
        const maxIterations = 1000;

        for (let i = 0; i < maxIterations; i++) {
            let npv = 0;
            let derivative = 0;

            for (const cf of cashFlows) {
                const years =
                    (cf.date.getTime() - firstDate.getTime()) /
                    (1000 * 60 * 60 * 24 * 365);

                const discount = Math.pow(1 + rate, years);

                if (!isFinite(discount) || discount === 0) return null;

                npv += cf.amount / discount;

                derivative -=
                    (years * cf.amount) /
                    (discount * (1 + rate));
            }

            if (!isFinite(derivative) || derivative === 0) return null;

            const newRate = rate - npv / derivative;

            if (!isFinite(newRate)) return null;

            if (Math.abs(newRate - rate) < tolerance) {
                return newRate;
            }

            rate = newRate;
        }

        return null;
    }
}