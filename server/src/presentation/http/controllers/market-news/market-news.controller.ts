import { IGetMarketNewsUseCase } from "@application/use_cases/market-news/interfaces/get-market-news-usecase.interfac";
import { HttpStatus } from "@domain/enum/express/status-code";
import { MARKET_NEWS_TYPES } from "@infrastructure/inversify_di/features/market-news/market-news.types";
import { ResponseHelper } from "@presentation/express/utils/response-handling/response.helper";
import { SuccessMessages } from "@shared/constants/success.messages";
import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";

@injectable()
export class MarketNewsControllers {
    constructor(
        @inject(MARKET_NEWS_TYPES.GetMarketNewsUseCase) private readonly getMarketNewsUseCase: IGetMarketNewsUseCase,
    ) { }


    async getMarketNews(req: Request, res: Response, next: NextFunction) {
        try {
            const { query, category } = req.query;
            const news = await this.getMarketNewsUseCase.execute(
                query as string,
                category as string
            );
            return ResponseHelper.success(
                res,
                SuccessMessages.DATA.FETCHED,
                news,
                HttpStatus.OK,
            )
        } catch (error) {
            next(error);
        }
    }
} 