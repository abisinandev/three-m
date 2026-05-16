import { Schema, model } from "mongoose";
import { SipInstallmentDocument } from "../../interfaces/mutual-fund/sip-intallment-schema-interface";
import { SipInstallmentStatus } from "@domain/enum/funds/sip-intallment-status";

const SipInstallmentSchema = new Schema<SipInstallmentDocument>(
    {
        sipId: {
            type: Schema.Types.ObjectId,
            required: true,
            index: true,
            ref: "SipPlan"
        },
        userId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "User",
            index: true,
        },
        schemeCode: {
            type: String,
            required: true,
        },
        installmentNo: {
            type: Number,
            required: true,
        },
        executionDate: {
            type: Date,
            required: true,
            index: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: Object.values(SipInstallmentStatus),
            required: true,
        },
        nav: {
            type: Number,
        },
        units: {
            type: Number,
        },
        failureReason: {
            type: String,
        },
        investmentId: {
            type: String,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        versionKey: false,
    }
);

SipInstallmentSchema.index(
    { sipId: 1, installmentNo: 1 },
    { unique: true }
);

export const SipInstallmentModel = model<SipInstallmentDocument>(
    "SipInstallment",
    SipInstallmentSchema
);
