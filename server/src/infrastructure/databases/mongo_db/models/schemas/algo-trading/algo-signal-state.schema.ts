import mongoose, { Schema, Document } from "mongoose";

export interface SignalStateDocument extends Document {
    userId: string;
    algoId: string;
    symbol: string;
    lastAction: string;
    timestamp: number;
}

const signalStateSchema = new Schema<SignalStateDocument>({
    userId: { type: String, required: true },
    algoId: { type: String, required: true },
    symbol: { type: String, required: true },
    lastAction: { type: String, required: true },
    timestamp: { type: Number, required: true },
});

// Compound index for unique check and fast lookup per user
signalStateSchema.index({ userId: 1, algoId: 1, symbol: 1 }, { unique: true });

export const SignalStateModel = mongoose.model<SignalStateDocument>("SignalState", signalStateSchema);
