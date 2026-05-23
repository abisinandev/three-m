import { model, Schema, Document } from "mongoose";
import { IWatchlist } from "../../interfaces/stocks/watchlist-schema-interface";

export type WatchlistDocument = Document & IWatchlist;

export const WatchlistSchema = new Schema<WatchlistDocument>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },
        symbol: {
            type: String,
            required: true,
            uppercase: true,
            index: true
        }
    },
    {
        timestamps: true
    }
);

// Compound index to ensure a user can't add the same stock twice
WatchlistSchema.index(
    { userId: 1, symbol: 1 },
    { unique: true }
);

export const WatchlistModel = model<WatchlistDocument>("Watchlist", WatchlistSchema);
