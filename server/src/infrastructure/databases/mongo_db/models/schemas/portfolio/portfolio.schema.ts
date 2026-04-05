import { model, Schema, Document } from "mongoose";
import { IPortfolio } from "../../interfaces/portfolio/portfolio.schema.interface";

export type PortfolioDocument = Document & IPortfolio;

export const PortfolioSchema = new Schema<PortfolioDocument>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true
        },
        symbol: {
            type: String,
            required: true,
            uppercase: true,
            index: true
        },
        quantity: {
            type: Number,
            required: true,
            default: 0
        },
        avgPrice: {
            type: Number,
            required: true,
            default: 0
        },
        investedAmount: {
            type: Number,
            required: true,
            default: 0
        },
        lockQty: {
            type: Number,
            required: true,
            default: 0
        }
    },
    {
        timestamps: true
    }
);

PortfolioSchema.index(
    { userId: 1, symbol: 1 },
    { unique: true }
);

export const PortfolioModel = model<PortfolioDocument>("Portfolio", PortfolioSchema);
