import { SipData } from "../types/sip.types";

export const getTotalInstallments = (
    durationInMonths: number,
    frequency: SipData['frequency']
): number => {
    switch (frequency) {
        case 'DAILY':
            return Math.round((durationInMonths * 365) / 12);
        case 'WEEKLY':
            return Math.round((durationInMonths * 52) / 12);
        case 'YEARLY':
            return Math.max(1, Math.round(durationInMonths / 12));
        case 'MONTHLY':
        default:
            return durationInMonths;
    }
};