import { Schema, model, type Document } from "mongoose";
import { IAlgoStrategySchema } from "../../interfaces/algo/algo-strategy-schema.interface";

export type AlgoStrategyDocument = Document & IAlgoStrategySchema;

const AlgoStrategySchema = new Schema<AlgoStrategyDocument>(
  {
    userId: { type: String, required: true, index: true },
    symbol: { type: String, required: true, index: true },
    strategyName: { type: String, required: true },
    config: { type: Schema.Types.Mixed, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const AlgoStrategyModel = model<AlgoStrategyDocument>("AlgoStrategy", AlgoStrategySchema);
