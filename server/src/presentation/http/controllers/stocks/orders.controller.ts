import { inject, injectable } from "inversify";
import type { NextFunction, Request, Response } from "express";
import { HttpStatus } from "@domain/enum/express/status-code";
import { BuyOrderDTO } from "@application/dto/stocks/buy-order.dto";
import { SellOrderDTO } from "@application/dto/stocks/sell-order.dto";
import { LimitBuyOrderDTO } from "@application/dto/stocks/limit-order.dto";
import { ResponseHelper } from "@presentation/express/utils/response-handling/response.helper";
import { SuccessMessages } from "@shared/constants/success.messages";
import { STOCK_TYPES } from "@infrastructure/inversify_di/features/stock/stock.types";
import { IMarketBuyOrderUseCase } from "@application/use_cases/stock/interfaces/buy-order-usecase.interface";
import { IMarketSellOrderUseCase } from "@application/use_cases/stock/interfaces/market-sell-order-usecase.interface";
import { ILimitBuyOrderUseCase } from "@application/use_cases/stock/interfaces/limit-buy-order-usecase.interface";
import { ILimitSellOrderUseCase } from "@application/use_cases/stock/interfaces/limit-sell-order-usecase.interface";
import { ICancelLimitOrderUseCase } from "@application/use_cases/stock/interfaces/cancel-limit-order-usecase.interface";
import { LimitSellOrderDTO } from "@application/dto/stocks/limit-order.dto";
import { IFetchPendingOrdersUseCase } from "@application/use_cases/stock/interfaces/fetch-pending-orders-usecase.interface";

@injectable()
export class OrdersController {
    constructor(
        @inject(STOCK_TYPES.MarketBuyOrderUseCase) private readonly _buyOrderUseCase: IMarketBuyOrderUseCase,
        @inject(STOCK_TYPES.MarketSellOrderUseCase) private readonly _sellOrderUseCase: IMarketSellOrderUseCase,
        @inject(STOCK_TYPES.LimitBuyOrderUseCase) private readonly _limitBuyOrderUseCase: ILimitBuyOrderUseCase,
        @inject(STOCK_TYPES.LimitSellOrderUseCase) private readonly _limitSellOrderUseCase: ILimitSellOrderUseCase,
        @inject(STOCK_TYPES.CancelLimitOrderUseCase) private readonly _cancelLimitOrderUseCase: ICancelLimitOrderUseCase,
        @inject(STOCK_TYPES.FetchPendingOrdersUseCase) private readonly _fetchPendingOrdersUseCase: IFetchPendingOrdersUseCase,
    ) { }

    async buy(req: Request, res: Response, next: NextFunction) {
        try {
            const buyOrderDto: BuyOrderDTO = req.body;
            const userId = req.user?.id as string;

            const result = await this._buyOrderUseCase.execute(buyOrderDto, userId);
            
            if (result?.upgrade) {
                return ResponseHelper.success(
                    res,
                    result.message,
                    null,
                    HttpStatus.PAYMENT_REQUIRED
                )
            }

            return ResponseHelper.success(
                res,
                SuccessMessages.STOCK.BUY_ORDER,
                result,
                HttpStatus.OK,
            );
        } catch (error) {
            next(error);
        }
    }

    async sell(req: Request, res: Response, next: NextFunction) {
        try {
            const sellOrderDto: SellOrderDTO = req.body;
            const userId = req.user?.id as string;

            const result = await this._sellOrderUseCase.execute(sellOrderDto, userId);

            if (result?.upgrade) {
                return ResponseHelper.success(
                    res,
                    result.message,
                    null,
                    HttpStatus.PAYMENT_REQUIRED
                )
            }

            return ResponseHelper.success(
                res,
                SuccessMessages.STOCK.SELL_ORDER,
                result,
                HttpStatus.OK,
            );
        } catch (error) {
            next(error);
        }
    }

    async limitBuy(req: Request, res: Response, next: NextFunction) {
        try {
            const limitBuyOrderDto: LimitBuyOrderDTO = req.body;
            const userId = req.user?.id as string;

            const result = await this._limitBuyOrderUseCase.execute(limitBuyOrderDto, userId);

            if (result?.upgrade) {
                return ResponseHelper.success(
                    res,
                    result.message,
                    null,
                    HttpStatus.PAYMENT_REQUIRED
                )
            }

            return ResponseHelper.success(
                res,
                SuccessMessages.STOCK.LIMIT_ORDER_PLACED,
                result,
                HttpStatus.CREATED,
            );
        } catch (error) {
            next(error);
        }
    }

    async limitSell(req: Request, res: Response, next: NextFunction) {
        try {
            const limitSellOrderDto: LimitSellOrderDTO = req.body;
            const userId = req.user?.id as string;

            const result = await this._limitSellOrderUseCase.execute(limitSellOrderDto, userId);

            if (result?.upgrade) {
                return ResponseHelper.success(
                    res,
                    result.message,
                    null,
                    HttpStatus.PAYMENT_REQUIRED
                )
            }

            return ResponseHelper.success(
                res,
                SuccessMessages.STOCK.LIMIT_ORDER_PLACED,
                null,
                HttpStatus.CREATED,
            );
        } catch (error) {
            next(error);
        }
    }

    async getPendingOrders(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id as string;
            const symbol = req.query.symbol as string | undefined;
            const result = await this._fetchPendingOrdersUseCase.execute(userId, symbol);

            return ResponseHelper.success(
                res,
                SuccessMessages.DATA.FETCHED,
                result,
                HttpStatus.OK,
            );
        } catch (error) {
            next(error);
        }
    }


    async cancelLimitOrder(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id as string;
            const { orderId } = req.params;

            await this._cancelLimitOrderUseCase.execute(orderId as string, userId);

            return ResponseHelper.success(
                res,
                SuccessMessages.STOCK.LIMIT_ORDER_CANCELLED,
                null,
                HttpStatus.OK,
            );
        } catch (error) {
            next(error);
        }
    }
}
