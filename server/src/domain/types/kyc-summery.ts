import { KycStatusType } from "@domain/enum/users/kyc-status.enum";

export type KycSummary = {
    id: string;
    status: KycStatusType;
    panNumber: string | null;
    aadharNumber: string | null;
    address?: {
        fullAddress: string;
        city: string;
        state: string;
        pinCode: string;
    };
};
