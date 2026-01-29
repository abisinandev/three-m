import { SipFrequency, SipStatus } from "@domain/enum/funds/sip.enums";

export class SipEntity {
    private readonly _id?: string;

    private readonly _userId: string;
    private readonly _schemeCode: string;

    private readonly _amount: number;

    private readonly _frequency: SipFrequency;

    private readonly _startDate: Date;
    private readonly _nextExecutionDate: Date;

    private readonly _totalInstallments: number;
    private readonly _executedInstallments: number;

    private readonly _status: SipStatus;
    private readonly _failureReason?: string;

    private readonly _createdAt: Date;
    private readonly _updatedAt?: Date;

    private constructor(props: {
        id?: string;
        userId: string;
        schemeCode: string;
        amount: number;
        frequency: SipFrequency;
        startDate: Date;
        nextExecutionDate: Date;
        totalInstallments: number;
        executedInstallments: number;
        status: SipStatus;
        failureReason?: string;
        createdAt: Date;
        updatedAt?: Date;
    }) {
        this._id = props.id;
        this._userId = props.userId;
        this._schemeCode = props.schemeCode;
        this._amount = props.amount;
        this._frequency = props.frequency;
        this._startDate = props.startDate;
        this._nextExecutionDate = props.nextExecutionDate;
        this._totalInstallments = props.totalInstallments;
        this._executedInstallments = props.executedInstallments;
        this._status = props.status;
        this._failureReason = props.failureReason;
        this._createdAt = props.createdAt;
        this._updatedAt = props.updatedAt;
    }


    static create(data: {
        userId: string;
        schemeCode: string;
        amount: number;
        frequency: SipFrequency;
        startDate: Date;
        totalInstallments: number;
    }): SipEntity {
        return new SipEntity({
            userId: data.userId,
            schemeCode: data.schemeCode,
            amount: data.amount,
            frequency: data.frequency,
            startDate: data.startDate,
            nextExecutionDate: data.startDate,
            totalInstallments: data.totalInstallments,
            executedInstallments: 0,
            status: SipStatus.ACTIVE,
            createdAt: new Date(),
        });
    }


    static executeInstallment(
        sip: SipEntity,
        nextExecutionDate: Date
    ): SipEntity {

        if (sip._status !== SipStatus.ACTIVE) {
            throw new Error("SIP is not active");
        }

        if (sip._executedInstallments >= sip._totalInstallments) {
            throw new Error("SIP already completed");
        }

        const executedInstallments = sip._executedInstallments + 1;
        const status =
            executedInstallments >= sip._totalInstallments
                ? SipStatus.COMPLETED
                : SipStatus.ACTIVE;

        return new SipEntity({
            id: sip._id,
            userId: sip._userId,
            schemeCode: sip._schemeCode,
            amount: sip._amount,
            frequency: sip._frequency,
            startDate: sip._startDate,
            nextExecutionDate,
            totalInstallments: sip._totalInstallments,
            executedInstallments,
            status,
            createdAt: sip._createdAt,
            updatedAt: new Date(),
        });
    }

    static pause(sip: SipEntity): SipEntity {
        if (sip._status !== SipStatus.ACTIVE) {
            throw new Error("Only active SIP can be paused");
        }

        return new SipEntity({
            ...sip.toPersistence(),
            status: SipStatus.PAUSED,
            updatedAt: new Date(),
        });
    }

    static cancel(sip: SipEntity): SipEntity {
        if (sip._status === SipStatus.COMPLETED) {
            throw new Error("Completed SIP cannot be cancelled");
        }

        return new SipEntity({
            ...sip.toPersistence(),
            status: SipStatus.CANCELLED,
            updatedAt: new Date(),
        });
    }


    static fromPersistence(props: {
        id: string;
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
        updatedAt?: Date;
    }): SipEntity {
        return new SipEntity(props);
    }


    toPersistence() {
        return {
            id: this._id,
            userId: this._userId,
            schemeCode: this._schemeCode,
            amount: this._amount,
            frequency: this._frequency,
            startDate: this._startDate,
            nextExecutionDate: this._nextExecutionDate,
            totalInstallments: this._totalInstallments,
            executedInstallments: this._executedInstallments,
            status: this._status,
            failureReason: this._failureReason,
            createdAt: this._createdAt,
            updatedAt: this._updatedAt,
        };
    }


    get id() { return this._id; }
    get userId() { return this._userId; }
    get schemeCode() { return this._schemeCode; }
    get amount() { return this._amount; }
    get frequency() { return this._frequency; }
    get startDate() { return this._startDate; }
    get nextExecutionDate() { return this._nextExecutionDate; }
    get totalInstallments() { return this._totalInstallments; }
    get executedInstallments() { return this._executedInstallments; }
    get status() { return this._status; }
    get failureReason() { return this._failureReason; }
    get createdAt() { return this._createdAt; }
    get updatedAt() { return this._updatedAt; }
}
