import { LimitBuyOrderDTO } from "@application/dto/stocks/limit-order.dto";

export interface ILimitBuyOrderUseCase {
    execute(order: LimitBuyOrderDTO,useId:string): Promise<undefined | { message: string, upgrade: boolean }>;
}