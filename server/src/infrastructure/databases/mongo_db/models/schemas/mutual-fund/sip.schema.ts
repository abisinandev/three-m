import { Schema, model } from "mongoose";
import { SipFrequency, SipStatus } from "@domain/enum/funds/sip.enums";
import { SipDocument } from "../../interfaces/mutual-fund/sip.schema.interface";

const SipSchema = new Schema<SipDocument>(
    {
        userId: {
            type: String,
            // required: true,
            index: true,
        },

        schemeCode: {
            type: String,
            // required: true,
            index: true,
        },

        amount: {
            type: Number,
            // required: true,
            min: 1,
        },

        frequency: {
            type: String,
            enum: Object.values(SipFrequency),
            // required: true,
        },

        startDate: {
            type: Date,
            // required: true,
        },

        nextExecutionDate: {
            type: Date,
            // required: true,
            index: true,
        },

        totalInstallments: {
            type: Number,
            // required: true,
            min: 1,
        },

        executedInstallments: {
            type: Number,
            default: 0,
        },

        status: {
            type: String,
            enum: Object.values(SipStatus),
            default: SipStatus.ACTIVE,
            index: true,
        },
    },
    {
        timestamps: true,
    }
);

export const SipModel = model<SipDocument>("SipPlan", SipSchema);
