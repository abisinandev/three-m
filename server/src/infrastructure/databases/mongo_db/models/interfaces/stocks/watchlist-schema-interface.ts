import { Document, Types } from "mongoose";

export interface IWatchlist extends Document {
    userId: Types.ObjectId;
    symbol: string;
    createdAt: Date;
}
