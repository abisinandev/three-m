import { InvestmentStatus, InvestmentType } from "@domain/enum/funds/investment.enums";
import { Document, Types } from "mongoose";

export interface InvestmentDocument extends Document {
    id: Types.ObjectId;

    userId: Types.ObjectId;  
    schemeCode: string;              

    type: InvestmentType;
    amount: number;
    units: number;

    nav: number;
    navDate: Date;

    status: InvestmentStatus;

    createdAt: Date;
    updatedAt: Date;
}
