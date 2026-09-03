import { FundDetails } from "./details.types";

export interface StartSipModalProps {
    data: FundDetails;
    onClose: () => void;
    onProceed: (sipData: SipData) => void;
    isSubmitting?: boolean;
}

export interface SipData {
    amount: number;
    frequency: "DAILY" | 'WEEKLY' | "MONTHLY" | "YEARLY";
    startDate: string;
    totalInstallments: number;
}