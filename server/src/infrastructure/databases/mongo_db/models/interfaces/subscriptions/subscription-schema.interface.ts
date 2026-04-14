import { SubscriptionPlans } from "@domain/entities/subscription/enums/plans.enum";
import { SubscriptionStatus } from "@domain/entities/subscription/enums/subscription-status.enums";
import { Types } from "mongoose";

export interface ISubscription {
    id?: Types.ObjectId;
    userId: Types.ObjectId;
    planCode: SubscriptionPlans;
    startDate: Date;
    endDate: Date;
    status: SubscriptionStatus;
    createdAt?: Date;
    updatedAt?: Date;
}