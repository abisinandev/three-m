import { KycStatusType } from "@domain/enum/users/kyc-status.enum";

export type KycSummary = {

    status: KycStatusType;
    panNumber: string | null;
    aadharNumber: string | null;
    address?: {
        fullAddress: string;
        city: string;
        state: string;
        pinCode: string;
    };
    rejectionReason?: string | null;
    submissionCount: number;
};
