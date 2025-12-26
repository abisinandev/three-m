import { AuthProvider } from "@domain/enum/users/auth-provider.enum";
import { CurrencyTypes } from "@domain/enum/users/currency-enum";
import { KycStatusType } from "@domain/enum/users/kyc-status.enum";
import { SubscripionPlan } from "@domain/enum/users/subscription-plan.enum";
import { SubscriptionStatus } from "@domain/enum/users/subscription-status.enum";
import { Role } from "@domain/enum/users/user-role.enum";
import { Email } from "@domain/value-objects/user/email.vo";
import { Password } from "@domain/value-objects/user/password.vo";
import { Phone } from "@domain/value-objects/user/phone.vo";
import { UserCode } from "@domain/value-objects/user/user-code.vo";
import { WalletSummary } from "@domain/types/wallet-summery";
import { KycSummary } from "@domain/types/kyc-summery";

export class UserEntity {
  private readonly _id: string | null;
  private readonly _userCode: UserCode;

  private _fullName: string;
  private readonly _email: Email;
  private _phone: Phone | null;
  private _password: Password | null;

  private _role: Role;

  private _isEmailVerified: boolean;
  private _isVerified: boolean;
  private _isBlocked: boolean;

  private _subscriptionStatus: SubscriptionStatus;
  private _subscriptionPlan: SubscripionPlan;
  private _currency: CurrencyTypes;

  private _kycId: string | null;
  private _kycStatus: KycStatusType;

  private _walletId: string | null;

  private readonly _wallet?: WalletSummary | null;
  private readonly _kyc?: KycSummary | null;

  private _isTwoFactorEnabled: boolean;
  private _twoFactorSecret: string | null;
  private _qrCodeUrl: string | null;

  private readonly _createdAt: Date;
  private _updatedAt: Date;

  private _authProvider: AuthProvider;
  private _avatar: string | null;
  private _googleId: string | null;

  private constructor(props: {
    id?: string | null;
    userCode: UserCode;
    fullName: string;
    email: Email;
    phone?: Phone | null;
    password?: Password | null;
    role: Role;
    isEmailVerified: boolean;
    isVerified: boolean;
    isBlocked: boolean;
    subscriptionStatus: SubscriptionStatus;
    subscriptionPlan: SubscripionPlan;
    currency: CurrencyTypes;
    kycId?: string | null;
    kycStatus: KycStatusType;
    walletId?: string | null;
    kyc?: KycSummary | null;
    wallet?: WalletSummary | null;
    isTwoFactorEnabled: boolean;
    twoFactorSecret?: string | null;
    qrCodeUrl?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
    authProvider: AuthProvider;
    avatar?: string | null;
    googleId?: string | null;
  }) {
    if (props.fullName.length < 2) {
      throw new Error("Full name must be at least 2 characters");
    }

    this._id = props.id ?? null;
    this._userCode = props.userCode;

    this._fullName = props.fullName;
    this._email = props.email;
    this._phone = props.phone ?? null;
    this._password = props.password ?? null;

    this._role = props.role;
    this._isEmailVerified = props.isEmailVerified;
    this._isVerified = props.isVerified;
    this._isBlocked = props.isBlocked;

    this._subscriptionStatus = props.subscriptionStatus;
    this._subscriptionPlan = props.subscriptionPlan;
    this._currency = props.currency;

    this._kycId = props.kycId ?? null;
    this._kycStatus = props.kycStatus;

    this._walletId = props.walletId ?? null;
    this._wallet = props.wallet;
    this._kyc = props.kyc;
    this._isTwoFactorEnabled = props.isTwoFactorEnabled;
    this._twoFactorSecret = props.twoFactorSecret ?? null;
    this._qrCodeUrl = props.qrCodeUrl ?? null;

    this._createdAt = props.createdAt ?? new Date();
    this._updatedAt = props.updatedAt ?? new Date();

    this._authProvider = props.authProvider;
    this._avatar = props.avatar ?? null;
    this._googleId = props.googleId ?? null;
  }

  static create(data: {
    fullName: string;
    email: string;
    phone: string;
    password: string;
    role?: Role;
    currency?: CurrencyTypes;
  }): UserEntity {
    return new UserEntity({
      userCode: UserCode.create("USR"),
      fullName: data.fullName,
      email: Email.create(data.email),
      phone: Phone.create(data.phone),
      password: Password.create(data.password),
      role: data.role ?? Role.USER,
      isEmailVerified: false,
      isVerified: false,
      isBlocked: false,
      subscriptionStatus: SubscriptionStatus.INACTIVE,
      subscriptionPlan: SubscripionPlan.FREE,
      currency: data.currency ?? CurrencyTypes.INR,
      kycStatus: KycStatusType.NULL,
      isTwoFactorEnabled: false,
      authProvider: AuthProvider.MANUAL,
    });
  }

  static createSocialUser(data: {
    fullName: string;
    email: string;
    provider: AuthProvider;
    avatar?: string;
    googleId?: string;
  }): UserEntity {
    return new UserEntity({
      userCode: UserCode.create("USR"),
      fullName: data.fullName,
      email: Email.create(data.email),
      phone: null,
      password: null,
      role: Role.USER,
      isEmailVerified: true,
      isVerified: false,
      isBlocked: false,
      subscriptionStatus: SubscriptionStatus.INACTIVE,
      subscriptionPlan: SubscripionPlan.FREE,
      currency: CurrencyTypes.INR,
      kycStatus: KycStatusType.NULL,
      isTwoFactorEnabled: false,
      authProvider: data.provider,
      avatar: data.avatar ?? null,
      googleId: data.googleId ?? null,
    });
  }

  static reconstitute(props: {
    id: string;
    userCode: string;
    fullName: string;
    email: string;
    phone?: string | null;
    password?: string | null;
    role: Role;
    isEmailVerified: boolean;
    isVerified: boolean;
    isBlocked: boolean;
    subscriptionStatus: SubscriptionStatus;
    subscriptionPlan: SubscripionPlan;
    currency: CurrencyTypes;
    kycId?: string | null;
    kyc?: KycSummary | null;
    kycStatus: KycStatusType;

    walletId?: string | null;
    wallet?: WalletSummary | null;

    isTwoFactorEnabled: boolean;
    twoFactorSecret?: string | null;
    qrCodeUrl?: string | null;
    createdAt: Date;
    updatedAt: Date;
    authProvider: AuthProvider;
    avatar?: string | null;
    googleId?: string | null;
  }): UserEntity {
    return new UserEntity({
      ...props,
      userCode: UserCode.rebuild(props.userCode),
      email: Email.create(props.email),
      phone: props.phone ? Phone.create(props.phone) : null,
      password: props.password ? Password.rebuild(props.password) : null,
    });
  }



  get id() {
    return this._id;
  }
  get userCode() {
    return this._userCode.value;
  }
  get fullName() {
    return this._fullName;
  }
  get email() {
    return this._email.value;
  }
  get phone() {
    return this._phone?.value ?? null;
  }
  get password() {
    return this._password?.value ?? null;
  }
  get role() {
    return this._role;
  }
  get currency() {
    return this._currency;
  }
  get kycStatus() {
    return this._kycStatus;
  }
  get isTwoFactorEnabled() {
    return this._isTwoFactorEnabled;
  }
  get isEmailVerified() {
    return this._isEmailVerified;
  }
  get isBlocked() {
    return this._isBlocked;
  }
  get isVerified() {
    return this._isVerified;
  }
  get subscriptionStatus() {
    return this._subscriptionStatus;
  }
  get subscriptionPlan() {
    return this._subscriptionPlan;
  }
  get kycId() {
    return this._kycId ?? null;
  }

  get walletId(): string | null {
    return this._walletId ?? null;
  }

  get wallet(): WalletSummary | null {
    return this._wallet ?? null;
  }

  get kyc() {
    return this._kyc;
  }
  get twoFactorSecret() {
    return this._twoFactorSecret ?? null;
  }
  get qrCodeUrl() {
    return this._qrCodeUrl ?? null;
  }
  get createdAt() {
    return this._createdAt ?? null;
  }
  get authProvider() {
    return this._authProvider;
  }
  get avatar() {
    return this._avatar ?? null;
  }
  get googleId() {
    return this._googleId ?? null;
  }
  
  get updatedAt() {
    return this._updatedAt ?? null;
  }

  changePassword(newPassword: string): void {
    this._password = Password.create(newPassword);
  }

  verifyEmail(): void {
    this._isEmailVerified = true;
  }

  block(): void {
    this._isBlocked = true;
  }

  unblock(): void {
    this._isBlocked = false;
  }

  enable2FA(secret: string): void {
    this._twoFactorSecret = secret;
  }

  setPending2FA(secret: string): void {
    this._qrCodeUrl = secret;
  }

  setQrCode(qrCode: string): void {
    this._qrCodeUrl = qrCode;
  }

  updateKycStatus(status: KycStatusType): void {
    this._kycStatus = status;
  }


}
