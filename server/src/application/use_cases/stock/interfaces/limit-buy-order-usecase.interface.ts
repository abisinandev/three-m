import { LimitBuyOrderDTO } from "@application/dto/stocks/limit-order.dto";

export interface ILimitBuyOrderUseCase {
    execute(order: LimitBuyOrderDTO,useId:string): Promise<void | { message: string, upgrade: boolean }>;
}