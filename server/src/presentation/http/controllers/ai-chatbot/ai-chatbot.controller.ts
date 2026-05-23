import { IChatbotUseCase } from "@application/use_cases/ai-chatbot/interface/chatbot-usecase.interface";
import { HttpStatus } from "@domain/enum/express/status-code";
import { AI_SYSTEM_TYPES } from "@infrastructure/inversify_di/features/ai-system/ai-system.type";
import { ResponseHelper } from "@presentation/express/utils/response-handling/response.helper";
import { SuccessMessages } from "@shared/constants/success.messages";
import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";

import { IConfirmBotBuyOrderUseCase } from "@application/use_cases/ai-chatbot/interface/confirm-bot-order-usecase.interface";

@injectable()
export class AiChatbotController {
    constructor(
        @inject(AI_SYSTEM_TYPES.ChatbotUseCase) private readonly _chatbotUseCase: IChatbotUseCase,
        @inject(AI_SYSTEM_TYPES.ConfirmBotBuyOrderUseCase) private readonly _confirmBotBuyOrderUseCase: IConfirmBotBuyOrderUseCase,
    ) { }

    async chat(req: Request, res: Response, next: NextFunction) {
        try {
            const { message } = req.body;
            const userId = req.user?.id as string;

            const result = await this._chatbotUseCase.execute(userId, message);

            if (result?.upgradeRequired) {
                return ResponseHelper.success(
                    res,
                    SuccessMessages.AI_CHATBOT.UPGRADE_PLAN,
                    result,
                    HttpStatus.OK
                );
            }

            return ResponseHelper.success(
                res,
                SuccessMessages.AI_CHATBOT.DATA,
                result,
                HttpStatus.OK  
            );
        } catch (error) {
            next(error);
        }
    }

    async confirmOrder(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id as string;
            const { symbol, quantity } = req.body;

            const result = await this._confirmBotBuyOrderUseCase.execute({ userId, symbol, quantity });

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
                "Order executed successfully via Chatbot",
                null,
                HttpStatus.OK
            );
        } catch (error) {
            next(error);
        }
    }

    async getHistory(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id as string;

            const history = await this._chatbotUseCase.getHistory(userId);

            return ResponseHelper.success(
                res,
                SuccessMessages.DATA.FETCHED,
                history,
                HttpStatus.OK
            );
        } catch (error) {
            next(error);
        }
    }
}