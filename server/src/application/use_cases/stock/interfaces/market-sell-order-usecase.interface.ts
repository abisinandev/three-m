import { SellOrderDTO } from "@application/dto/stocks/sell-order.dto";

export interface IMarketSellOrderUseCase {
    execute(order: SellOrderDTO, userId: string): Promise<undefined | { message: string, upgrade: boolean }>;
}