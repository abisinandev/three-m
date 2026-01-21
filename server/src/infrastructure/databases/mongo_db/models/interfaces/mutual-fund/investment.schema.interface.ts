import { InvestmentStatus, InvestmentType, PaymentMethod } from "@domain/enum/funds/investment.enums";
import { Document, Types } from "mongoose";

export interface InvestmentDocument extends Document {
    _id: Types.ObjectId;

    userId: Types.ObjectId;
    sipInstallmentId?: Types.ObjectId;
    schemeCode: string;

    amount: number;
    units: number;
    remainingUnits: number;
    redeemedUnits: number;
    redeemedAt: Date;
    nav: number;
    navDate: Date;
    investmentType: InvestmentType,
    paymentMethod: PaymentMethod
    status: InvestmentStatus;

    createdAt: Date;
    updatedAt: Date;
}