import { SipInstallmentStatus } from "@domain/enum/funds/sip-intallment-status";
import { Types } from "mongoose";

export interface SipInstallmentDocument extends Document {
    _id: Types.ObjectId;

    sipId: Types.ObjectId;
    userId: Types.ObjectId;
    schemeCode: string;

    installmentNo: number;
    executionDate: Date;

    amount: number;

    status: SipInstallmentStatus;

    nav?: number;
    units?: number;

    failureReason?: string;
    investmentId?: string;
    retryCount: number;

    createdAt: Date;
}
