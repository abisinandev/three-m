import { InvestmentStatus, InvestmentType, PaymentMethod } from "@domain/enum/funds/investment.enums";
import { InvestmentRedeemResult } from "@domain/types/radeem-units.types";
import { ValidationError } from "@presentation/express/utils/error-handling";

export class InvestmentEntity {
    private readonly _id?: string;
    private readonly _userId: string;
    private readonly _schemeCode: string;

    private readonly _amount: number;
    private readonly _units?: number;
    private readonly _nav?: number;
    private readonly _navDate?: Date;
    private readonly _sipInstallmentId?: string;

    private _remainingUnits?: number;
    private _redeemedUnits?: number;
    private _redeemedAmount?: number;
    private _redeemedAt?: Date;

    private _status: InvestmentStatus;
    private readonly _paymentMethod: PaymentMethod;
    private readonly _investmentType: InvestmentType;

    private readonly _createdAt: Date;
    private _updatedAt?: Date;

    private constructor(props: {
        id?: string;
        userId: string;
        schemeCode: string;

        amount: number;
        units?: number;

        nav?: number;
        navDate?: Date;

        remainingUnits?: number;
        redeemedUnits?: number;
        redeemedAmount?: number;
        redeemedAt?: Date;

        status: InvestmentStatus;
        paymentMethod: PaymentMethod;
        investmentType: InvestmentType;
        sipInstallmentId?: string;

        createdAt: Date;
        updatedAt?: Date;
    }) {
        this._id = props.id;
        this._userId = props.userId;
        this._schemeCode = props.schemeCode;

        this._amount = props.amount;
        this._units = props.units;
        this._nav = props.nav;
        this._navDate = props.navDate;

        this._remainingUnits = props.remainingUnits;
        this._redeemedUnits = props.redeemedUnits;
        this._redeemedAt = props.redeemedAt;
        this._redeemedAmount = props.redeemedAmount;
        this._status = props.status;
        this._paymentMethod = props.paymentMethod;
        this._investmentType = props.investmentType;
        this._sipInstallmentId = props.sipInstallmentId;
        this._createdAt = props.createdAt;
        this._updatedAt = props.updatedAt;
    }

    static create(data: {
        userId: string;
        schemeCode: string;
        amount: number;
        investmentType: InvestmentType;
        paymentMethod: PaymentMethod;
        sipInstallmentId?: string;
    }): InvestmentEntity {
        return new InvestmentEntity({
            userId: data.userId,
            schemeCode: data.schemeCode,
            amount: data.amount,
            status: InvestmentStatus.INITIATED,
            investmentType: data.investmentType,
            paymentMethod: data.paymentMethod,
            sipInstallmentId: data.sipInstallmentId,
            createdAt: new Date(),
        });
    }

    static allotNav(
        investment: InvestmentEntity,
        data: { nav: number; navDate: Date }
    ): InvestmentEntity {

        if (investment._status !== InvestmentStatus.INITIATED) {
            throw new ValidationError("Invalid investment state");
        }

        if (data.nav <= 0) {
            throw new ValidationError("Invalid NAV");
        }

        const units = Number((investment._amount / data.nav).toFixed(4));

        return new InvestmentEntity({
            id: investment._id,
            userId: investment._userId,
            schemeCode: investment._schemeCode,
            amount: investment._amount,
            units,
            nav: data.nav,
            navDate: data.navDate,
            remainingUnits: units,
            status: InvestmentStatus.ALLOTTED,
            investmentType: investment._investmentType,
            paymentMethod: investment._paymentMethod,
            sipInstallmentId: investment._sipInstallmentId,
            createdAt: investment._createdAt,
            updatedAt: new Date(),
        });
    }

    redeemUnits(
        remainingUnits: number,
        redeemedUnits: number | undefined,
        unitsToRedeem: number,
        redeemedAmount: number,
    ): InvestmentEntity {

        if (unitsToRedeem <= 0 || unitsToRedeem > remainingUnits) {
            throw new ValidationError("Invalid redeem units");
        }

        const newRemaining = Number(
            (remainingUnits - unitsToRedeem).toFixed(4)
        );

        const newRedeemed = Number(
            ((redeemedUnits ?? 0) + unitsToRedeem).toFixed(4)
        );

        this._remainingUnits = newRemaining <= 0 ? 0 : newRemaining;
        this._redeemedAmount = (this._redeemedAmount ?? 0) + redeemedAmount;
        this._updatedAt = new Date();
        this._redeemedUnits = newRedeemed;

        if (newRemaining <= 0) {
            this._status = InvestmentStatus.REDEEMED;
            this._redeemedAt = new Date();
        } else {
            this._status = InvestmentStatus.PARTIALLY_REDEEMED;
            this._redeemedAt = new Date();
        }

        return this;
    }

    static fromPersistence(props: {
        id: string;
        userId: string;
        schemeCode: string;

        amount: number;
        units: number;

        nav: number;
        navDate: Date;

        remainingUnits: number;
        redeemedUnits: number;
        redeemedAmount: number;
        redeemedAt?: Date;

        status: InvestmentStatus;
        investmentType: InvestmentType;
        paymentMethod: PaymentMethod;
        sipInstallmentId?: string;
        createdAt: Date;
        updatedAt?: Date;
    }): InvestmentEntity {
        return new InvestmentEntity({
            id: props.id,
            userId: props.userId,
            schemeCode: props.schemeCode,
            amount: props.amount,
            units: props.units,
            nav: props.nav,
            navDate: props.navDate,
            remainingUnits: props.remainingUnits,
            redeemedUnits: props.redeemedUnits,
            redeemedAmount: props.redeemedAmount,
            redeemedAt: props.redeemedAt,
            status: props.status,
            investmentType: props.investmentType,
            paymentMethod: props.paymentMethod,
            sipInstallmentId: props.sipInstallmentId ?? undefined,
            createdAt: props.createdAt,
            updatedAt: props.updatedAt,
        });
    }

    get id() { return this._id; }
    get userId() { return this._userId; }
    get schemeCode() { return this._schemeCode; }
    get amount() { return this._amount; }
    get units() { return this._units; }
    get remainingUnits() { return this._remainingUnits; }
    get redeemedUnits() { return this._redeemedUnits; }
    get redeemedAmount() { return this._redeemedAmount; }
    get redeemedAt() { return this._redeemedAt; }
    get nav() { return this._nav; }
    get navDate() { return this._navDate; }
    get status() { return this._status; }
    get investmentType() { return this._investmentType; }
    get paymentMethod() { return this._paymentMethod; }
    get sipInstallmentId() { return this._sipInstallmentId; }
    get createdAt(): Date { return this._createdAt; }
    get updatedAt() { return this._updatedAt; }
}
