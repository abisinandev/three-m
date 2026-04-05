import { inject, injectable } from "inversify";
import type { NextFunction, Request, Response } from "express";
import { HttpStatus } from "@domain/enum/express/status-code";
import { BuyOrderDTO } from "@application/dto/stocks/BuyOrderDTO";
import { SellOrderDTO } from "@application/dto/stocks/SellOrderDTO";
import { ResponseHelper } from "@presentation/express/utils/response-handling/response.helper";
import { SuccessMessages } from "@shared/constants/success.messages";
import { STOCK_TYPES } from "@infrastructure/inversify_di/features/stock/stock.types";
import { IMarketBuyOrderUseCase } from "@application/use_cases/stock/interfaces/buy-order-usecase.interface";
import { IMarketSellOrderUseCase } from "@application/use_cases/stock/interfaces/market-sell-order-usecase.interface";

@injectable()
export class OrdersController {
    constructor(
        @inject(STOCK_TYPES.MarketBuyOrderUseCase) private readonly _buyOrderUseCase: IMarketBuyOrderUseCase,
        @inject(STOCK_TYPES.MarketSellOrderUseCase) private readonly _sellOrderUseCase: IMarketSellOrderUseCase,
    ) { }

    async buy(req: Request, res: Response, next: NextFunction) {
        try {
            const buyOrderDto: BuyOrderDTO = req.body;
            const userId = req.user?.id as string

            await this._buyOrderUseCase.execute(buyOrderDto, userId);

            return ResponseHelper.success(
                res,
                SuccessMessages.STOCK.BUY_ORDER,
                null,
                HttpStatus.OK,
            )
        } catch (error) {
            next(error)
        }
    }

    async sell(req: Request, res: Response, next: NextFunction) {
        try {
            const sellOrderDto: SellOrderDTO = req.body;
            const userId = req.user?.id as string;

            await this._sellOrderUseCase.execute(sellOrderDto, userId);

            return ResponseHelper.success(
                res,
                SuccessMessages.STOCK.SELL_ORDER,
                null,
                HttpStatus.OK,
            )
        } catch (error) {
            next(error)
        }
    }
}
