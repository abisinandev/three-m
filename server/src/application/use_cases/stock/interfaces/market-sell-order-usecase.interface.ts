import { SellOrderDTO } from "@application/dto/stocks/SellOrderDTO";

export interface IMarketSellOrderUseCase {
    execute(data: SellOrderDTO, userId: string): Promise<void>
}