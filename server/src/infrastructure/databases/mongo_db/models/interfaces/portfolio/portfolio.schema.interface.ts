import { Types } from "mongoose";

export interface IPortfolio {
    _id?: Types.ObjectId | string;
    userId: Types.ObjectId | string;
    symbol: string;
    quantity: number;
    avgPrice: number;
    investedAmount: number;
    createdAt?: Date;
    updatedAt?: Date;
}
