import { model, Schema, Document } from "mongoose";
import { IPortfolio } from "../../interfaces/portfolio/portfolio.schema.interface";
import { AssetType } from "@domain/entities/portfolio/enum/asset-type";
import { PortfolioStatus } from "@domain/entities/portfolio/enum/portfolio-status";

export type PortfolioDocument = Document & IPortfolio;

export const PortfolioSchema = new Schema<PortfolioDocument>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true
        },
        assetType: {
            type: String,
            enum: Object.values(AssetType),
            required: true,
            index: true
        },
        assetId: {
            type: Schema.Types.ObjectId,
            required: true,
            index: true
        },
        quantity: {
            type: Number,
            default: 0
        },
        units: {
            type: Number,
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
        },
        stopLoss: {
            type: Number,
            default: null
        },
        takeProfit: {
            type: Number,
            default: null
        },
        status: {
            type: String,
            enum: Object.values(PortfolioStatus),
            default: PortfolioStatus.ACTIVE,
            required: true
        }
    },
    {
        timestamps: true
    }
);

PortfolioSchema.index(
    { userId: 1, assetId: 1, assetType: 1 },
    { unique: true }
);

export const PortfolioModel = model<PortfolioDocument>("Portfolio", PortfolioSchema);
