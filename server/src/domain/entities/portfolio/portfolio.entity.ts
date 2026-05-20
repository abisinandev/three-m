import { ValidationError } from "@presentation/express/utils/error-handling";
import { AssetType } from "./enum/asset-type";
import { PortfolioStatus } from "./enum/portfolio-status";

export class PortfolioEntity {
    private readonly _id?: string;
    private readonly _userId: string;

    private readonly _assetId: string;
    private readonly _assetType: AssetType;

    private _quantity?: number;
    private _units?: number;
    private _avgPrice: number;
    private _investedAmount: number;

    private _lockQty: number;

    private _status: PortfolioStatus;

    private readonly _createdAt: Date;
    private _updatedAt?: Date;

    private constructor(props: {
        id?: string;
        userId: string;
        assetId: string;
        assetType: AssetType;
        quantity?: number;
        units?: number;
        avgPrice: number;
        investedAmount: number;
        lockQty?: number;
        status?: PortfolioStatus;
        createdAt?: Date;
        updatedAt?: Date;
    }) {
        this._id = props.id;
        this._userId = props.userId;

        this._assetId = props.assetId;
        this._assetType = props.assetType;

        this._quantity = props.quantity;
        this._units = props.units;
        this._avgPrice = props.avgPrice;
        this._investedAmount = props.investedAmount;

        this._lockQty = props.lockQty ?? 0;

        this._status = props.status ?? PortfolioStatus.ACTIVE;

        this._createdAt = props.createdAt ?? new Date();
        this._updatedAt = props.updatedAt;
    }

    static create(data: {
        userId: string;
        assetId: string;
        assetType: AssetType;
        quantity?: number;
        units?: number;
        avgPrice: number;
        investedAmount: number;
        status?: PortfolioStatus;
    }): PortfolioEntity {
        return new PortfolioEntity({
            userId: data.userId,
            assetId: data.assetId,
            assetType: data.assetType,
            quantity: data.quantity,
            units: data.units,
            avgPrice: data.avgPrice,
            investedAmount: data.investedAmount,
            lockQty: 0,
            status: data.status ?? PortfolioStatus.ACTIVE
        });
    }

    static fromPersistence(data: {
        id: string;
        userId: string;
        assetId: string;
        assetType: AssetType;
        quantity?: number;
        units?: number;
        avgPrice: number;
        investedAmount: number;
        lockQty: number;
        status: PortfolioStatus;
        createdAt: Date;
        updatedAt?: Date;
    }): PortfolioEntity {
        return new PortfolioEntity({
            id: data.id,
            userId: data.userId,
            assetId: data.assetId,
            assetType: data.assetType,
            quantity: data.quantity,
            units: data.units,
            avgPrice: data.avgPrice,
            investedAmount: data.investedAmount,
            lockQty: data.lockQty,
            status: data.status,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
        });
    }

    get assetId(): string {
        return this._assetId;
    }

    get assetType(): AssetType {
        return this._assetType;
    }

    get userId(): string {
        return this._userId;
    }

    get quantity(): number | undefined {
        return this._quantity;
    }

    get units(): number | undefined {
        return this._units;
    }

    get avgPrice(): number {
        return this._avgPrice;
    }

    get investedAmount(): number {
        return this._investedAmount;
    }

    get lockQty(): number {
        return this._lockQty;
    }



    get status(): PortfolioStatus {
        return this._status;
    }

    get id(): string | undefined {
        return this._id;
    }

    get createdAt(): Date {
        return this._createdAt;
    }

    get updatedAt(): Date | undefined {
        return this._updatedAt;
    }

    lockQuantity(qty: number) {
        const currentQty = this._quantity ?? 0;
        if (currentQty - this._lockQty < qty) {
            throw new ValidationError("Insufficient unlocked quantity");
        }

        this._lockQty += qty;
        this._updatedAt = new Date();
    }

    unlockQuantity(qty: number) {
        if (this._lockQty < qty) {
            throw new ValidationError("Cannot unlock more than locked quantity");
        }

        this._lockQty -= qty;
        this._updatedAt = new Date();
    }

    updateQuantityAndPrice(quantity: number, avgPrice: number, investedAmount: number) {
        this._quantity = quantity;
        this._avgPrice = avgPrice;
        this._investedAmount = investedAmount;

        if (this._assetType === AssetType.MUTUAL_FUND) {
            this._units = quantity;
        }

        if (quantity > 0) {
            this._status = PortfolioStatus.ACTIVE;
        } else if (quantity <= 0) {
            this._status = PortfolioStatus.CLOSED;
        }

        this._updatedAt = new Date();
    }

    updateUnits(units: number) {
        this._units = units;
        if (units > 0) {
            this._status = PortfolioStatus.ACTIVE;
        } else if (units === 0) {
            this._status = PortfolioStatus.CLOSED;
        }
        this._updatedAt = new Date();
    }



    closePortfolio() {
        this._status = PortfolioStatus.CLOSED;
        this._quantity = 0;
        this._units = 0;
        this._investedAmount = 0;
        this._lockQty = 0;
        this._updatedAt = new Date();
    }

    toPersistence() {
        return {
            id: this._id,
            userId: this._userId,
            assetId: this._assetId,
            assetType: this._assetType,
            quantity: this._quantity,
            units: this._units,
            avgPrice: this._avgPrice,
            investedAmount: this._investedAmount,
            lockQty: this._lockQty,
            status: this._status,
            createdAt: this._createdAt,
            updatedAt: this._updatedAt,
        };
    }

    toJSON() {
        return this.toPersistence();
    }
}