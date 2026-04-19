import { CurrencyTypes } from "@domain/enum/users/currency-enum";
import { WalletStatus } from "@domain/enum/wallet/wallet-status.enum";

export class WalletEntity {
  private readonly _id: string | null;
  private readonly _userId: string;
  private _balance: number;
  private _lockedBalance: number;
  private _currency: CurrencyTypes;
  private _status: WalletStatus;
  private _createdAt: Date;
  private _updatedAt: Date;

  private static MAX_BALANCE = 1_00000;

  private constructor(props: {
    id?: string | null;
    userId: string;
    balance: number;
    lockedBalance?: number;
    currency: CurrencyTypes;
    status?: WalletStatus;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    this._id = props.id ?? null;
    this._userId = props.userId;
    this._balance = props.balance;
    this._lockedBalance = props.lockedBalance ?? 0;
    this._currency = props.currency;
    this._status = props.status ?? WalletStatus.ACTIVE;
    this._createdAt = props.createdAt ?? new Date();
    this._updatedAt = props.updatedAt ?? new Date();

  }

  static create(data: {
    userId: string;
    balance?: number;
    currency: CurrencyTypes;
    status?: WalletStatus;
  }): WalletEntity {
    const balance = data.balance ?? 0;

    if (balance > this.MAX_BALANCE) {
      throw new Error("Wallet balance cannot exceed ₹100,000.");
    }

    return new WalletEntity({
      userId: data.userId,
      balance,
      currency: data.currency,
      status: data.status ?? WalletStatus.ACTIVE,
    });
  }

  static fromPersistence(data: {
    id: string;
    userId: string;
    balance: number;
    lockedBalance?: number;
    currency: CurrencyTypes;
    status: WalletStatus;
    createdAt?: Date;
    updatedAt?: Date;
  }): WalletEntity {
    return new WalletEntity({
      id: data.id,
      userId: data.userId,
      balance: data.balance,
      lockedBalance: data.lockedBalance ?? 0,
      currency: data.currency,
      status: data.status,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }


  get id() {
    return this._id;
  }

  get userId() {
    return this._userId;
  }

  get balance() {
    return this._balance;
  }

  get lockedBalance() {
    return this._lockedBalance;
  }

  get availableBalance() {
    return this._balance - this._lockedBalance;
  }

  get currency() {
    return this._currency;
  }

  get status() {
    return this._status;
  }

  get createdAt() {
    return this._createdAt;
  }

  get updatedAt() {
    return this._updatedAt;
  }


  credit(amount: number) {
    if (amount <= 0) throw new Error("Credit amount must be positive");

    if (this._balance + amount > WalletEntity.MAX_BALANCE) {
      throw new Error("Wallet balance cannot exceed ₹100,000.");
    }

    this._balance += amount;
    this._updatedAt = new Date();
  }

  debit(amount: number) {
    if (amount <= 0) throw new Error("Debit amount must be positive");

    if (amount > this.availableBalance) {
      throw new Error("Insufficient available balance");
    }

    this._balance -= amount;
    this._updatedAt = new Date();
  }

  lock(amount: number) {
    if (amount <= 0) throw new Error("Amount must be positive");

    if (amount > this.availableBalance) {
      throw new Error("Insufficient available balance to lock");
    }

    this._lockedBalance += amount;
    this._updatedAt = new Date();
  }

  unlock(amount: number) {
    if (amount <= 0) throw new Error("Amount must be positive");

    if (amount > this._lockedBalance) {
      throw new Error("Insufficient locked balance");
    }

    this._lockedBalance -= amount;
    this._updatedAt = new Date();
  }
  markSuccessful() {
    this._status = WalletStatus.ACTIVE;
    this._updatedAt = new Date();
  }

}
