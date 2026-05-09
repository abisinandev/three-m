import { CashFlow, IXirrCalculator } from "./xirr-calculation.interface";


/**
 * Portfolio XIRR Domain Service
 * 
 * Newton-Raphson logic
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
        const lastDate = cleaned[cleaned.length - 1].date;

        const portfolioAgeDays =
            (lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24);

        if (portfolioAgeDays < 30) return null;

        const rate = this.solveXirr(cleaned);

        if (rate === null) return null;

        let percentage = rate * 100;

        if (percentage > 1000000) return 999999.99;
        if (percentage < -100) return -100;

        return percentage;
    }

    private cleanCashFlows(cashFlows: CashFlow[]): CashFlow[] {
        if (cashFlows.length === 0) return [];

        // Map to group by date string (YYYY-MM-DD)
        const dailyGroups = new Map<string, number>();

        for (const cf of cashFlows) {
            const date = new Date(cf.date);
            date.setHours(0, 0, 0, 0);
            const dateKey = date.toISOString().split('T')[0];

            const currentAmount = dailyGroups.get(dateKey) || 0;
            dailyGroups.set(dateKey, currentAmount + cf.amount);
        }

        const cleaned = Array.from(dailyGroups.entries())
            .map(([dateStr, amount]) => ({
                date: new Date(dateStr),
                amount: amount
            }))
            .filter(cf => Math.abs(cf.amount) > 0.001) // Ignore zero net cashflows
            .sort((a, b) => a.date.getTime() - b.date.getTime());

        return cleaned;
    }


    private solveXirr(cashFlows: CashFlow[]): number | null {
        const hasPositive = cashFlows.some(c => c.amount > 0);
        const hasNegative = cashFlows.some(c => c.amount < 0);

        if (!hasPositive || !hasNegative) return null;

        const firstDate = cashFlows[0].date;

        const guesses = [0.1, 0.5, -0.1, 0.01, 1.0];

        for (const guess of guesses) {
            let rate = guess;
            const tolerance = 1e-7;
            const maxIterations = 100;

            for (let i = 0; i < maxIterations; i++) {
                let npv = 0;
                let derivative = 0;

                for (const cf of cashFlows) {
                    const years =
                        (cf.date.getTime() - firstDate.getTime()) /
                        (1000 * 60 * 60 * 24 * 365);

                    const base = 1 + rate;

                    if (base <= 0) {
                        npv = NaN;
                        break;
                    }

                    const discount = Math.pow(base, years);

                    if (!isFinite(discount) || discount === 0) {
                        npv = NaN;
                        break;
                    }

                    npv += cf.amount / discount;
                    derivative -= (years * cf.amount) / (discount * base);
                }

                if (isNaN(npv) || !isFinite(derivative) || derivative === 0) break;

                const newRate = rate - npv / derivative;

                if (!isFinite(newRate)) break;

                if (Math.abs(newRate - rate) < tolerance) {
                    return newRate;
                }

                rate = newRate;

                if (Math.abs(rate) > 1000000) break;
            }
        }

        return null;
    }
}