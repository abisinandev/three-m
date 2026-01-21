import { SipFrequency, SipStatus } from "@domain/enum/funds/sip.enums";

export interface SipDto {
    readonly id?: string;

    readonly userId: string;
    readonly schemeCode: string;

    readonly amount: number;
    readonly frequency: SipFrequency;

    readonly startDate: Date;
    readonly nextExecutionDate: Date;

    readonly totalInstallments: number;
    readonly executedInstallments: number;

    readonly status: SipStatus;

    readonly createdAt: Date;
    readonly updatedAt?: Date;
}
