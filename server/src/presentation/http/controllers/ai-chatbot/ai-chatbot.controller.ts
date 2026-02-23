import { IChatbotUseCase } from "@application/use_cases/ai-chatbot/interface/chatbot-usecase.interface";
import { SuccessMessage } from "@domain/enum/express/messages/success.message";
import { HttpStatus } from "@domain/enum/express/status-code";
import { AI_SYSTEM_TYPES } from "@infrastructure/inversify_di/features/ai-system/ai-system.type";
import { ResponseHelper } from "@presentation/express/utils/response-handling/response.helper";
import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";

@injectable()
export class AiChatbotController {
    constructor(
        @inject(AI_SYSTEM_TYPES.ChatbotUseCase) private readonly _chatbotUseCase: IChatbotUseCase,
    ) { }

    async chat(req: Request, res: Response, next: NextFunction) {
        try {
            const { message } = req.body;

            const result = await this._chatbotUseCase.execute(message);

            return ResponseHelper.success(
                res,
                SuccessMessage.DATA_FETCHED,
                result,
                HttpStatus.OK
            );
        } catch (error) {
            next(error);
        }
    }
}