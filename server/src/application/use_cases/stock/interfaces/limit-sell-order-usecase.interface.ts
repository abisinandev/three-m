import { LimitSellOrderDTO } from "@application/dto/stocks/limit-order.dto";

export interface ILimitSellOrderUseCase {
    execute(order: LimitSellOrderDTO, userId: string): Promise<void | { message: string, upgrade: boolean }>;
}
