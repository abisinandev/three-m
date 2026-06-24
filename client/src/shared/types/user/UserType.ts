import type { WalletData } from "../../../modules/user/wallet/types/wallet.types";
import type { KycUser } from "./KycUserType";

export type UserType = {
    userCode: string;

    fullName: string;
    email: string;
    phone: string | null;

    role: string;
    authProvider: string;
    isVerified: boolean;
    kycId: string;
    isSubscribed: boolean;
    isBlocked: boolean;
    isTwoFactorEnabled: boolean;
    isAlgoEnabled: boolean;

    subscription: {
        status: string;
        plan: string;
    };

    wallet: WalletData;
    kyc: KycUser;
    walletId: string;
    kycStatus: string;

    currency: string;

    panNumber?: string;
    aadharNumber?: string;
    address?: {
        fullAddress?: string;
        city: string;
        state: string;
        pincode: string;
    };

    // Profile
    avatar: string | null;
    googleId: string | null;
    createdAt: string;
};
