import {
  IsEnum,
  IsOptional,
  IsNumber,
  IsString,
  IsArray,
  IsBoolean,
  ArrayNotEmpty
} from "class-validator";
import { Type } from "class-transformer";
import { SubscriptionPlans } from "@domain/entities/subscription/enums/plans.enum";

export class UpdatePlanDTO {
  
  @IsEnum(SubscriptionPlans)
  code!: SubscriptionPlans;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  price!: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  durationInDays!: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  features!: string[];

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isActive!: boolean;
}