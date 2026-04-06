import { OrderType } from "@domain/entities/stock/enum/order-type.enum";
import { IsEnum, IsNumber, IsOptional, IsString, Min } from "class-validator";


export class BuyOrderDTO {
  @IsString()
  symbol!: string;

  @IsNumber()
  @Min(1)
  quantity!: number;

  @IsEnum(OrderType)
  orderType!: OrderType;

  @IsOptional()
  @IsNumber()
  @Min(0.01)
  price?: number;

  @IsOptional()
  @IsNumber()
  @Min(0.01)
  stopLoss?: number;

  @IsOptional()
  @IsNumber()
  @Min(0.01)
  takeProfit?: number;
}
