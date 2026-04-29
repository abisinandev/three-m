import { inject, injectable } from "inversify";
import { AI_SYSTEM_TYPES } from "@infrastructure/inversify_di/features/ai-system/ai-system.type";
import { IConfirmBotBuyOrderUseCase } from "@application/use_cases/ai-chatbot/interface/confirm-bot-order-usecase.interface";

@injectable()
export class TradeExecutionAgent {
    constructor(
        @inject(AI_SYSTEM_TYPES.ConfirmBotBuyOrderUseCase) private readonly _confirmBotBuyOrder: IConfirmBotBuyOrderUseCase,
    ) { }

    /**
     * Strictly deterministic order preparation.
     * No LLM is involved in the actual confirmation logic.
     */
    async prepareOrder(userId: string, symbol: string, quantity: number): Promise<string> {
        console.log(`[TradeExecutionAgent] Preparing order for ${userId}: ${quantity} shares of ${symbol}`);
        
        const result = await this._confirmBotBuyOrder.execute({ userId, symbol, quantity });

        if (result && result.upgrade) {
            return result.message;
        }

        // Return the signal that the frontend uses to show the confirmation modal
        return `CONFIRM_TRADE:${symbol}:${quantity}`;
    }
}
