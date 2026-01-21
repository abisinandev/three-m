import { SipFrequency } from "@domain/enum/funds/sip.enums";

export const calculateNextExecutionDate = (
    currentExecutionDate: Date,
    frequency: SipFrequency
): Date => {
    const nextDate = new Date(currentExecutionDate);

    nextDate.setHours(0, 0, 0, 0);

    switch (frequency) {
        case SipFrequency.DAILY:
            nextDate.setDate(nextDate.getDate() + 1);
            break;

        case SipFrequency.WEEKLY:
            nextDate.setDate(nextDate.getDate() + 7);
            break;

        case SipFrequency.MONTHLY:
            nextDate.setMonth(nextDate.getMonth() + 1);
            break;

        case SipFrequency.QUARTERLY:
            nextDate.setMonth(nextDate.getMonth() + 3);
            break;

        default:
            throw new Error(`Unsupported SIP frequency: ${frequency}`);
    }

    return nextDate;
};
