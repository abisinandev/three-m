import { Schema, model, Document } from "mongoose";
import { IBlockSchema } from "../interfaces/block.interface";
 
export type BlockDocument = Document & IBlockSchema;

const BlockSchema = new Schema<BlockDocument>(
    {
        index: {
            type: Number,
            required: true,
            unique: true,
        },

        prevHash: {
            type: String,
            // required: true,
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
    }
);

export const BlockModel = model<BlockDocument>("Block", BlockSchema);
