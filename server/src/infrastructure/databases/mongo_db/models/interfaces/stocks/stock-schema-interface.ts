import { StocksStatus } from "@domain/entities/stock/stocks.enum";
import { Document, Types } from "mongoose";

export interface IStock extends Document {
    id: Types.ObjectId
    symbol: string;
    exchange: string;
    name: string;
    sector: string;
    status: StocksStatus;
    isTradable: boolean;
    createdAt: Date;
    updatedAt: Date;
}