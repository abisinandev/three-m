import { IConfirmRedeemUseCase } from "@application/use_cases/portfolio/interfaces/confirm-redeem-usecase.interface";
import { IPortfolioSummaryUseCase } from "@application/use_cases/portfolio/interfaces/portfolio-summary-usecase.interface";
import { IRadeemInvestmentUseCase } from "@application/use_cases/portfolio/interfaces/redeem-investments-usecase.interface";
import { SuccessMessages } from "@shared/constants/success.messages";
import { HttpStatus } from "@domain/enum/express/status-code";
import { ResponseHelper } from "@presentation/express/utils/response-handling/response.helper";
import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { PORTFOLIO_TYPES } from "@infrastructure/inversify_di/features/portfolio/portfolio.types";
import { IXirrCalculationUseCase } from "@application/use_cases/portfolio/interfaces/xirr-calculation-usecase.interface";
import { IPortfolioProjectionUseCase } from "@application/use_cases/portfolio/interfaces/portfolio-projection-usecase.interface";
import { IFetchPortfolioAssetsUsecase } from "@application/use_cases/portfolio/interfaces/fetch-portfolio-assets.usecase.interface";
import { IFetchPortfolioHistoryUseCase } from "@application/use_cases/portfolio/interfaces/fetch-portfolio-history-usecase.interface";
import { IFetchMutualFundHoldingsUseCase } from "@application/use_cases/portfolio/interfaces/fetch-mf-holdings-usecase.interface";
import { IFetchStockHoldingsUseCase } from "@application/use_cases/portfolio/interfaces/fetch-stock-holdings-usecase.interface";

@injectable()
export class PortFolioController {
    constructor(
        @inject(PORTFOLIO_TYPES.RadeemInvestmentUseCase) private readonly _radeemInvestments: IRadeemInvestmentUseCase,
        @inject(PORTFOLIO_TYPES.ConfirmRedeemUseCase) private readonly _confirmRedeem: IConfirmRedeemUseCase,
        @inject(PORTFOLIO_TYPES.PortfolioSummaryUseCase) private readonly _portfolioSummaryUseCase: IPortfolioSummaryUseCase,
        @inject(PORTFOLIO_TYPES.XirrCalculationUseCase) private readonly _xirrCalculation: IXirrCalculationUseCase,
        @inject(PORTFOLIO_TYPES.PortfolioProjectionUseCase) private readonly _portfolioProjection: IPortfolioProjectionUseCase,
        @inject(PORTFOLIO_TYPES.FetchPortfolioHistoryUseCase) private readonly _fetchPortfolioHistory: IFetchPortfolioHistoryUseCase,
        @inject(PORTFOLIO_TYPES.FetchPortfolioAssetsUseCase) private readonly _fetchPortfolioAssets: IFetchPortfolioAssetsUsecase,
        @inject(PORTFOLIO_TYPES.FetchMutualFundHoldingsUseCase) private readonly _fetchMFHoldings: IFetchMutualFundHoldingsUseCase,
        @inject(PORTFOLIO_TYPES.FetchStockHoldingsUseCase) private readonly _fetchStockHoldings: IFetchStockHoldingsUseCase,
    ) { }


    async portfolioSummary(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req?.user?.id;
            const result = await this._portfolioSummaryUseCase.execute(userId as string);
            return ResponseHelper.success(
                res,
                SuccessMessages.DATA.FETCHED,
                result,
                HttpStatus.OK,
            )
        } catch (error) {
            next(error);
        }
    }

    async redeemInvestments(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req?.user?.id;
            const result = await this._radeemInvestments.execute(userId as string);
            return ResponseHelper.success(
                res,
                SuccessMessages.DATA.FETCHED,
                result,
                HttpStatus.OK,
            )
        } catch (error) {
            next(error)
        }
    }

    async confirmRedeem(req: Request, res: Response, next: NextFunction) {
        try {
            const dto = { ...req.body }
            const userId = req?.user?.id;
            const result = await this._confirmRedeem.execute({ ...dto, userId });
            return ResponseHelper.success(
                res,
                SuccessMessages.DATA.FETCHED,
                result,
                HttpStatus.OK,
            )
        } catch (error) {
            next(error)
        }
    }


    async xirrCalculation(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req?.user?.id;
            const result = await this._xirrCalculation.execute(userId as string);
            return ResponseHelper.success(
                res,
                SuccessMessages.DATA.FETCHED,
                result,
                HttpStatus.OK,
            )
        } catch (error) {
            next(error)
        }
    }

    async returnProjection(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req?.user?.id;
            const result = await this._portfolioProjection.execute({
                expectedReturnRate: 12,
                years: 10,
            }, userId as string);
            return ResponseHelper.success(
                res,
                SuccessMessages.DATA.FETCHED,
                result,
                HttpStatus.OK,
            )
        } catch (error) {
            next(error)
        }
    }

    async listTradeHistory(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req?.user?.id;
            const result = await this._fetchPortfolioHistory.execute(userId as string, req.query);
            return ResponseHelper.success(
                res,
                SuccessMessages.DATA.FETCHED,
                result,
                HttpStatus.OK,
            )
        } catch (error) {
            next(error)
        }
    }

    async listAssets(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req?.user?.id;
            const result = await this._fetchPortfolioAssets.execute(userId as string, req.query);
            return ResponseHelper.success(
                res,
                SuccessMessages.DATA.FETCHED,
                result,
                HttpStatus.OK,
            )
        } catch (error) {
            next(error)
        }
    }

    async listMFAssets(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req?.user?.id;
            const result = await this._fetchMFHoldings.execute(userId as string, req.query);
            return ResponseHelper.success(
                res,
                SuccessMessages.DATA.FETCHED,
                result,
                HttpStatus.OK,
            )
        } catch (error) {
            next(error)
        }
    }

    async listStockAssets(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req?.user?.id;
            const result = await this._fetchStockHoldings.execute(userId as string, req.query);
            return ResponseHelper.success(
                res,
                SuccessMessages.DATA.FETCHED,
                result,
                HttpStatus.OK,
            )
        } catch (error) {
            next(error)
        }
    }
}
