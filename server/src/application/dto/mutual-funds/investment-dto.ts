import {
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsPositive,
    IsString,
    Min,
} from 'class-validator';

import { InvestmentType, PaymentMethod } from '@domain/enum/funds/investment.enums';

export class InvestmentDTO {
    @IsString()
    @IsNotEmpty()
    schemeCode!: string;

    @IsNumber()
    @IsPositive()
    @Min(1000)
    amount!: number;

    @IsNumber()
    @IsPositive()
    @IsOptional()
    units!: number;

    @IsEnum(PaymentMethod)
    paymentMethod!: PaymentMethod;

    @IsEnum(InvestmentType)
    investmentType!: InvestmentType;
}