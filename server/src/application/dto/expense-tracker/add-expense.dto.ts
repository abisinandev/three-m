import {
    IsNumber,
    IsString,
    IsEnum,
    IsOptional,
    IsDateString
} from 'class-validator';

export enum ExpenseType {
    NEED = 'NEED',
    WANT = 'WANT',
}

export enum PaymentMode {
    CASH = 'CASH',
    BANK = 'BANK',
    UPI = 'UPI',
    WALLET = 'WALLET',
}

export class AddExpenseDTO {

    @IsNumber()
    amount!: number;

    @IsString()
    category!: string;

    @IsEnum(ExpenseType)
    type!: ExpenseType;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsDateString()
    date?: string;

    @IsOptional()
    @IsEnum(PaymentMode)
    paymentMode?: PaymentMode;
}
