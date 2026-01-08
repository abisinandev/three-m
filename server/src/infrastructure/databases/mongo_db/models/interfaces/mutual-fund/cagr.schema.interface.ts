import { Document, Types } from "mongoose";

export interface MfCAGRDocument extends Document {
    id: Types.ObjectId;
    schemeCode: string;

    cagr1Y?: number;
    cagr3Y?: number;
    cagr5Y?: number;

    createdAt?: Date;
    updatedAt: Date;
}
