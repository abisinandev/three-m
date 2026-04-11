import { Document, model, Schema } from "mongoose";
import { ISubscription } from "../../interfaces/subscriptions/subscription-schema.interface";
import { SubscriptionStatus } from "@domain/entities/subscription/enums/subscription-status.enums";

export type SubscriptionDocument = ISubscription & Document;

const subscriptionSchema = new Schema<SubscriptionDocument>(
    {
        userId: {
            type: String,
            required: true,
            index: true,
        },
        plans: {
            type: String,
            enum: ["FREE", "PREMIUM"],
            required: true,
        },
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
            required: true,
            index: true,
        },
        status: {
            type: String,
            enum: Object.values(SubscriptionStatus),
            required: true,
            default: SubscriptionStatus.ACTIVE,
            index: true,
        },
    },
    {
        timestamps: true,
    }
);

subscriptionSchema.index({ userId: 1, status: 1 });

export const SubscriptionModel = model<SubscriptionDocument>(
    "Subscription",
    subscriptionSchema
);