import { Schema, model, Document } from "mongoose";
import type { IBlockSchema } from "../../interfaces/transaction/block.interface";

export type BlockDocument = Document & IBlockSchema;

const BlockSchema = new Schema<BlockDocument>(
    {
        index: {
            type: Number,
            required: true,
            unique: true,
        },
        blockId: {
            type: String,
            required: true,
        },
        prevHash: {
            type: String,
            default: null,
        },

        txHash: {
            type: String,
            required: true,
            index: true,
        },

        blockHash: {
            type: String,
            required: true,
            unique: true,
        },

        timestamp: {
            type: Number,
            required: true,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

BlockSchema.index({ index: 1, blockHash: 1 }, { unique: true });
export const BlockModel = model<BlockDocument>("Block", BlockSchema);
