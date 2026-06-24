import { AuthProvider } from "@domain/enum/users/auth-provider.enum";
import { CurrencyTypes } from "@domain/enum/users/currency-enum";
import { KycStatusType } from "@domain/enum/users/kyc-status.enum";
import { Schema, model, type Document } from "mongoose";
import { IUserSchema } from "../../interfaces/user/user.schema.interface";
import { Role } from "@domain/enum/users/user-role.enum";
import { SubscriptionStatus } from "@domain/entities/subscription/enums/subscription-status.enums";
import { SubscriptionPlans } from "@domain/entities/subscription/enums/plans.enum";
 
export type UserDocument = Document & IUserSchema;

const UserSchema = new Schema<UserDocument>(
  {
    userCode: { type: String, unique: true, index: true },

    fullName: { type: String, required: true },

    email: { type: String, required: true, unique: true, index: true },

    phone: {
      type: String,
      required: function (this: UserDocument) {
        return this.authProvider === AuthProvider.MANUAL;
      },
      default: null,
    },

    password: {
      type: String,
      required: function (this: UserDocument) {
        return this.authProvider === AuthProvider.MANUAL;
      },
      default: null,
    },

    role: {
      type: String,
      enum: Object.values(Role),
      default: Role.USER,
    },

    isVerified: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },

    kycId: {
      type: Schema.Types.ObjectId,
      ref: "KycDetails",
      default: null,
    },

    kycStatus: {
      type: String,
      enum: Object.values(KycStatusType),
      default: KycStatusType.NULL,
    },

    walletId: {
      type: Schema.Types.ObjectId,
      ref: "Wallet",
      index: true,
      default: null,
    },

    currency: {
      type: String,
      enum: Object.values(CurrencyTypes),
      default: CurrencyTypes.INR,
    },

    subscriptionId: {
      type: Schema.Types.ObjectId,
      ref: "Subscription",
      default: null,
    },

    subscriptionStatus: {
      type: String,
      enum: Object.values(SubscriptionStatus),
      default: SubscriptionStatus.INACTIVE,
    },

    subscriptionPlan: {
      type: String,
      enum: Object.values(SubscriptionPlans),
      default: SubscriptionPlans.FREE,
    },

    isTwoFactorEnabled: { type: Boolean, default: false },

    twoFactorSecret: {
      type: String,
      default: null,
    },

    qrCodeUrl: { type: String, default: null },

    isAlgoEnabled: { type: Boolean, default: false },

    authProvider: {
      type: String,
      enum: Object.values(AuthProvider),
      default: AuthProvider.MANUAL,
    },

    avatar: { type: String, default: null },

    googleId: {
      type: String,
      index: true,
      default: null,
    },
  },
  { timestamps: true }
);

export const UserModel = model<UserDocument>("User", UserSchema);
