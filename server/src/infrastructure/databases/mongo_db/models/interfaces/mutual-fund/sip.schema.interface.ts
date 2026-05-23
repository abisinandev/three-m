import { Document } from "mongoose";
import { SipFrequency, SipStatus } from "@domain/enum/funds/sip.enums";

export interface SipDocument extends Document {
    userId: string;
    schemeCode: string;

    amount: number; 

    frequency: SipFrequency;

    startDate: Date;
    nextExecutionDate: Date;

    totalInstallments: number;
    executedInstallments: number;

    status: SipStatus;
    failureReason: string;
    
    createdAt: Date;
    updatedAt: Date;
}
