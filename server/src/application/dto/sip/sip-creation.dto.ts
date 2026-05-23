import {
    IsString,
    IsNotEmpty,
    IsInt,
    Min,
    IsEnum,
    IsDateString,
} from "class-validator";
import { SipFrequency } from "@domain/enum/funds/sip.enums";
import { PaymentMethod } from "@domain/enum/funds/investment.enums";

export class SipCreationDTO {

    @IsString()
    @IsNotEmpty({ message: "Scheme code is required" })
    schemeCode!: string;

    @IsInt({ message: "Amount must be an integer" })
    @Min(500, { message: "Minimum SIP amount is 500" })
    amount!: number;

    @IsEnum(SipFrequency, { message: "Invalid SIP frequency" })
    frequency!: SipFrequency;

    @IsDateString({}, { message: "Start date must be a valid date" })
    startDate!: string;

    @IsInt({ message: "Total installments must be an integer" })
    @Min(1, { message: "At least one installment is required" })
    totalInstallments!: number;

    @IsEnum(PaymentMethod, { message: "Invalid payment method" })
    paymentMethod!: PaymentMethod;
}
