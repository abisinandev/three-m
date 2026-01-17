import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumberString,
  ValidateIf
} from "class-validator";

export class ConfirmRedeemDTO {

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  userId!: string;

  @IsString()
  @IsNotEmpty()
  schemeCode!: string;

  @IsOptional()
  @IsNumberString({ no_symbols: true })
  @ValidateIf(o => !o.amount) 
  units?: string;

  @IsOptional()
  @IsNumberString({ no_symbols: true })
  @ValidateIf(o => !o.units)
  amount?: string;
}
