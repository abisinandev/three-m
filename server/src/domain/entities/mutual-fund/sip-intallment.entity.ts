import { SipInstallmentStatus } from "@domain/enum/funds/sip-intallment-status";

export class SipInstallmentEntity {
    private readonly _id?: string;

    private readonly _sipId: string;
    private readonly _userId: string;
    private readonly _schemeCode: string;

    private readonly _installmentNo: number;
    private readonly _executionDate: Date;

    private readonly _amount: number;

    private readonly _nav?: number;
    private readonly _units?: number;

    private readonly _status: SipInstallmentStatus;
    private readonly _failureReason?: string;

    private readonly _investmentId?: string;

    private readonly _createdAt: Date;

    private constructor(props: {
        id?: string;
        sipId: string;
        userId: string;
        schemeCode: string;
        installmentNo: number;
        executionDate: Date;
        amount: number;
        status: SipInstallmentStatus;
        nav?: number;
        units?: number;
        failureReason?: string;
        investmentId?: string;
        createdAt: Date;
    }) {
        this._id = props.id;
        this._sipId = props.sipId;
        this._userId = props.userId;
        this._schemeCode = props.schemeCode;
        this._installmentNo = props.installmentNo;
        this._executionDate = props.executionDate;
        this._amount = props.amount;
        this._status = props.status;
        this._nav = props.nav;
        this._units = props.units;
        this._failureReason = props.failureReason;
        this._investmentId = props.investmentId;
        this._createdAt = props.createdAt;
    }


    static create(data: {
        sipId: string;
        userId: string;
        schemeCode: string;
        installmentNo: number;
        executionDate: Date;
        amount: number;
    }): SipInstallmentEntity {
        return new SipInstallmentEntity({
            ...data,
            status: SipInstallmentStatus.PENDING,
            createdAt: new Date(),
        });
    }

    static markSuccess(
        installment: SipInstallmentEntity,
        data: {
            nav: number;
            units: number;
            investmentId: string;
        }
    ): SipInstallmentEntity {
        return new SipInstallmentEntity({
            ...installment.toPersistence(),
            status: SipInstallmentStatus.SUCCESS,
            nav: data.nav,
            units: data.units,
            investmentId: data.investmentId,
        });
    }

    static markFailed(
        installment: SipInstallmentEntity,
        reason: string
    ): SipInstallmentEntity {
        return new SipInstallmentEntity({
            ...installment.toPersistence(),
            status: SipInstallmentStatus.FAILED,
            failureReason: reason,
        });
    }


    static fromPersistence(props: {
        id: string;
        sipId: string;
        userId: string;
        schemeCode: string;
        installmentNo: number;
        executionDate: Date;
        amount: number;
        status: SipInstallmentStatus;
        nav?: number;
        units?: number;
        failureReason?: string;
        investmentId?: string;
        createdAt: Date;
    }): SipInstallmentEntity {
        return new SipInstallmentEntity(props);
    }

    toPersistence() {
        return {
            id: this._id,
            sipId: this._sipId,
            userId: this._userId,
            schemeCode: this._schemeCode,
            installmentNo: this._installmentNo,
            executionDate: this._executionDate,
            amount: this._amount,
            status: this._status,
            nav: this._nav,
            units: this._units,
            failureReason: this._failureReason,
            investmentId: this._investmentId,
            createdAt: this._createdAt,
        };
    }


    get id() { return this._id; }
    get sipId() { return this._sipId; }
    get userId() { return this._userId; }
    get schemeCode() { return this._schemeCode; }
    get installmentNo() { return this._installmentNo; }
    get executionDate() { return this._executionDate; }
    get amount() { return this._amount; }
    get status() { return this._status; }
    get nav() { return this._nav; }
    get units() { return this._units; }
    get failureReason() { return this._failureReason; }
    get investmentId() { return this._investmentId; }
    get createdAt() { return this._createdAt; }
}
