import { SubscriptionPlans } from "@domain/entities/subscription/enums/plans.enum";
import { Document, model, Schema } from "mongoose";
import { IPlans } from "../../interfaces/subscriptions/plans-schema.interface";

export type PlanDocument = IPlans & Document;

const planSchema = new Schema<PlanDocument>(
    {
        code: {
            type: String,
            enum: Object.values(SubscriptionPlans),
            required: true,
            unique: true,
            default: SubscriptionPlans.FREE,
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