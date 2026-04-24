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
                Retrieves the user's current portfolio summary including:
                - Total number of funds/stocks held
                - Total invested amount across mutual funds and stocks
                - Current portfolio market value
                - Profit/loss details including realized profits from sells
                - Overall return percentage
                - XIRR (annualized return rate based on cash flow timing)
                
                Use this tool when the user asks about:
                - Their portfolio performance or returns
                - How much they have invested or what it is worth now
                - Their profit, loss, or XIRR
                - An overall summary of their investments
            `,
            schema: z.object({}),
        }
    );
