import { OrderType } from "@domain/entities/stock/enum/order-type.enum";
import { IsEnum, IsNumber, IsOptional, IsString, Min } from "class-validator";

export class LimitBuyOrderDTO {
    @IsString()
    symbol!: string;

    @IsNumber()
    @Min(1)
    quantity!: number;

    @IsEnum(OrderType)
    orderType: OrderType = OrderType.LIMIT_ORDER;

    @IsNumber()
    @Min(0.01)
    price!: number;

    @IsOptional()
    @IsNumber()
    @Min(0.01)
    stopLoss?: number;

    @IsOptional()
    @IsNumber()
    @Min(0.01)
    takeProfit?: number;

    @IsOptional()
    isAlgoTrade?: boolean;
}

export class LimitSellOrderDTO extends LimitBuyOrderDTO {}