import { Types } from "mongoose";

export interface IQuote {
    id: Types.ObjectId;
    symbol: string;
    price?: number;
    open?: number;
    high?: number;
    low?: number;
    volume?: number;
    latestTradingDay?: Date;
    createdAt?: Date;
    updatedAt?: Date;
}