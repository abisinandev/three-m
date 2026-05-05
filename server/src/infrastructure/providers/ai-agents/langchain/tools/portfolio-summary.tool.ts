import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { IPortfolioSummaryUseCase } from "@application/use_cases/portfolio/interfaces/portfolio-summary-usecase.interface";


export const createPortfolioSummaryTool = (
    userId: string,
    portfolioSummaryUseCase: IPortfolioSummaryUseCase
) =>
    tool(
        async () => {
            const summary = await portfolioSummaryUseCase.execute(userId);

            return JSON.stringify({
                totalFunds: summary.totalCount,
                totalInvested: `₹${summary.totalInvestment.toFixed(2)}`,
                currentValue: `₹${summary.currentValue.toFixed(2)}`,
                totalProfit: `₹${summary.totalProfit.toFixed(2)}`,
                profitFromSells: `₹${summary.profitAfterSell.toFixed(2)}`,
                totalReturns: `₹${summary.totalReturns.toFixed(2)}`,
                returnPercentage: `${summary.profitPercentage.toFixed(2)}%`,
                xirr:
                    summary.xirr !== null
                        ? `${summary.xirr.toFixed(2)}%`
                        : "Insufficient data for XIRR calculation",
            });
        },
        {
            name: "get_portfolio_summary",
            description: `
                Retrieves the user's current portfolio summary. 
                IMPORTANT: All financial values (totalInvested, currentValue, totalProfit, etc.) are in Indian Rupees (INR).
                Always use the ₹ (rupee symbol) when presenting these values to the user.
                
                The returned data includes:
                - totalFunds: Total number of instruments
                - totalInvested: Amount invested (formatted with ₹)
                - currentValue: Current market value (formatted with ₹)
                - totalProfit: Overall profit/loss (formatted with ₹)
                - profitFromSells: Realized profit (formatted with ₹)
                - totalReturns: Absolute returns (formatted with ₹)
                - returnPercentage: Percentage gain/loss
                - xirr: Annualized returns (XIRR)
            `,
            schema: z.object({}),
        }
    );
