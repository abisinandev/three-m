export type UserType = {
    id: string;
    userCode: string;

    fullName: string;
    email: string;
    phone: string | null;

    role: string;
    authProvider: string;
    isVerified: boolean;
    isEmailVerified: boolean;
    kycId: string;
    isSubscribed: boolean;
    isBlocked: boolean;
    isTwoFactorEnabled: boolean;
    isAlgoEnabled: boolean;

    subscription: {
        status: string;
        plan: string;
    };

    wallet: any;
    kyc: any;
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
