import { IsString, IsNotEmpty, IsOptional, ValidateIf, IsNumber } from "class-validator";
import { Transform } from "class-transformer";

export class ConfirmRedeemDTO {

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  userId!: string;

  @IsString()
  @IsNotEmpty()
  schemeCode!: string;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @ValidateIf(o => !o.amount)
  units?: number;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @ValidateIf(o => !o.units)
  amount?: number;
}
