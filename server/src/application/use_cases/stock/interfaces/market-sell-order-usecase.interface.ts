import { SellOrderDTO } from "@application/dto/stocks/sell-order.dto";

export interface IMarketSellOrderUseCase {
    execute(data: SellOrderDTO, userId: string): Promise<void | { message: string, upgrade: boolean }>;
}