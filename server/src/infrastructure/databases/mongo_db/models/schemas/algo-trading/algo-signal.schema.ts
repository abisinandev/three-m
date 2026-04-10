import { Document, model, Schema, SchemaType } from "mongoose";
import { IAlgoSignalSchema } from "../../interfaces/algo/algo-signal-schema.interface";
import { SignalAction, SignalStatus } from "@domain/entities/algo/enum/signal-enums";

export type AlgoSignalDocument = IAlgoSignalSchema & Document;

export const AlgoSignalSchema = new Schema<AlgoSignalDocument>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            required: true,
            index: true,
        },
        algoId: {
            type: Schema.Types.ObjectId,
            required: true,
            index: true,
        },
        strategyName: {
            type: String,
        },
        symbol: {
            type: String,
            required: true,
            uppercase: true,
            trim: true,
            index: true,
        },

        action: {
            type: String,
            enum: Object.values(SignalAction),
            required: true,
        },

        price: {
            type: Number,
            required: true,
            min: 0,
        },

        reason: {
            type: String,
            required: true,
            trim: true,
        },

        status: {
            type: String,
            enum: Object.values(SignalStatus),
            required: true,
            default: SignalStatus.PENDING,
            index: true,
        },

        expiresAt: {
            type: Date,
            required: true,
        },

        createdAt: {
            type: Date,
            default: Date.now,
            immutable: true,
        },
    },
    { timestamps: true }
);

AlgoSignalSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
AlgoSignalSchema.index({ symbol: 1, status: 1 });

export const AlgoSignalModel = model<AlgoSignalDocument>('AlgoSignals', AlgoSignalSchema);