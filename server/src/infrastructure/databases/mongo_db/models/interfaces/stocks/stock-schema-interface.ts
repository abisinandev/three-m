import { Document, Types } from "mongoose";

export interface IStock extends Document {
    id: Types.ObjectId
    symbol: string;
    logo: string;
    exchange: string;
    name: string;
    sector: string;
    isTradable: boolean;
    isVisible: boolean;
    isTracked: boolean;
    createdAt: Date;
    updatedAt: Date;
}