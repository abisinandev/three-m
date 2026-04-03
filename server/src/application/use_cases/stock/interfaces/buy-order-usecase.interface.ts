import { BuyOrderDTO } from "@application/dto/stocks/BuyOrderDTO";

export interface IMarketBuyOrderUseCase {
    execute(data: BuyOrderDTO, userId: string): Promise<void>;
}