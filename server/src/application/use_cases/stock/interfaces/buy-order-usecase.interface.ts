import { BuyOrderDTO } from "@application/dto/stocks/buy-order.dto";

export interface IMarketBuyOrderUseCase {
    execute(data: BuyOrderDTO, userId: string): Promise<void | { message: string, upgrade: boolean }>;
}