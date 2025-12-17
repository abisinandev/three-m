import { CurrencyTypes } from "@domain/enum/users/currency-enum";
import { WalletStatus } from "@domain/enum/wallet/wallet-status.enum";

export class WalletEntity {
  private readonly _id: string | null;
  private readonly _userId: string | null;
  private _currency: CurrencyTypes;
  private _balance: number;
  private _status: WalletStatus;
  private _isVerified: boolean;
  private readonly _createdAt?: Date | null;
  private readonly _updatedAt?: Date | null;

  constructor(props: {
    id?: string | null;
    userId: string | null;
    balance: number;
    currency: CurrencyTypes;
    status?: WalletStatus;
    isVerified?: boolean;
    createdAt?: Date | null;
    updatedAt?: Date | null;
  }) {
    this._id = props.id || null;
    this._userId = props.userId || null;
    this._balance = props.balance;
    this._currency = props.currency;
    this._status = props.status || WalletStatus.ACTIVE;
    this._isVerified = props.isVerified ?? false;
    this._createdAt = props.createdAt || new Date();
    this._updatedAt = props.updatedAt || new Date();
  }

  // static create(data: {
  //   userId: string;
  //   balance: number;
  //   status: WalletStatus;
  //   currency: CurrencyTypes;
  // }): WalletEntity {
  //   return new WalletEntity({
  //     userId: data.userId,
  //     balance: data.balance,
  //     status: data.status,
  //     isVerified: true,
  //     currency: data.currency,
  //   })
  // } 

  get id() {
    return this._id;
  }

  get userId() {
    return this._userId;
  }

  get balance() {
    return this._balance;
  }

  get currency() {
    return this._currency;
  }

  get status() {
    return this._status;
  }

  get isVerified() {
    return this._isVerified;
  }

  get createdAt() {
    return this._createdAt;
  }

  get updatedAt() {
    return this._updatedAt;
  }

  credit(amount: number) {
    if (amount <= 0) throw new Error("Credit amount must be positive");
    this._balance += amount;
    // this._updatedAt = new Date();
  }

  debit(amount: number) {
    if (amount <= 0) throw new Error("Debit amount must be positive");
    if (amount > this._balance) throw new Error("Insufficient balance");
    this._balance -= amount;
    // this._updatedAt = new Date();
  }

  markSuccessful() {
    this._status = WalletStatus.ACTIVE;
    // this._updatedAt = new Date();
  }
}
