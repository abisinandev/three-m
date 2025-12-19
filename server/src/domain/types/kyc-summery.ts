import { KycStatusType } from "@domain/enum/users/kyc-status.enum";

export type KycSummary = {
    id: string;
    status: KycStatusType;
    panNumber: string | null;
    aadhaarNumber: string | null;
    address?: {
        fullAddress: string;
        city: string;
        state: string;
        pinCode: string;
    };
};
