import { Document, model, Schema } from "mongoose";
import { IPlans } from "../../interfaces/subscriptions/plans-schema.interface";

export type PlanDocument = IPlans & Document;

const planSchema = new Schema<PlanDocument>(
    {
        code: {
            type: String,
            enum: ["FREE", "PREMIUM"],
            required: true,
            unique: true,
        },
        price: {
            type: Number,
            required: true,
            default: 0,
        },
        durationInDays: {
            type: Number,
            required: true,
        },
        features: {
            type: [String],
            required: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

export const PlanModel = model<PlanDocument>("Plan", planSchema);