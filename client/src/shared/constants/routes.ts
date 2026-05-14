export const ROUTES = {
    HOME: "/",
    USER: {
        HOME: "/user/home",
        PROFILE: "/user/profile",
        MARKET_NEWS: "/user/market-news",
        KYC_VERIFICATION: "/user/kyc-verification",
        EXPENSE_TRACKER: "/user/expense-tracker",
        WALLET: {
            ROOT: "/user/wallet",
            ADD: "/user/wallet/add-to-wallet",
            WITHDRAW: "/user/wallet/withdraw",
        },
        PORTFOLIO: {
            ROOT: "/user/portfolio",
            REDEEM_PROFIT: "/user/portfolio/redeem-profit",
        },
        MUTUAL_FUNDS: {
            ROOT: "/user/mutual-funds",
            DETAILS: (schemeCode: string | number) => `/user/mutual-funds/${schemeCode}`,
        },
        PAYMENT: {
            SUCCESS: "/user/payment-success",
            FAILED: "/user/payment-failed",
        },
        TRADING: "/user/trading",
        AI_BOT: "/user/ai-bot",
    },
    AUTH: {
        LOGIN: "/auth/login",
        SIGNUP: {
            ROOT: "/auth/signup",
            VERIFY_OTP: "/auth/signup/verify-otp",
        },
        FORGOT_PASSWORD: {
            ROOT: "/auth/forgot-password",
            VERIFY_OTP: "/auth/forgot-password/verify-otp",
        },
        RESET_PASSWORD: "/auth/reset-password",
    },
    ADMIN: {
        AUTH: {
            LOGIN: "/admin/authentication",
            VERIFY_OTP: "/admin/authentication/verify-otp",
        },
        DASHBOARD: "/admin/dashboard",
        INSTALLMENTS: "/admin/installments",
        KYC_MANAGEMENT: {
            ROOT: "/admin/kyc-management",
            VIEW: (kycId: string) => `/admin/view-kyc/${kycId}`,
        },
        STOCK_MANAGEMENT: "/admin/stock-management",
        SIP_MANAGEMENT: {
            ROOT: "/admin/sip-management",
            DETAILS: (sipId: string) => `/admin/sip-details/${sipId}`,
        },
        TRANSACTIONS_MANAGEMENT: "/admin/transactions-management",
        USERS_MANAGEMENT: "/admin/users-management",
        MUTUAL_FUNDS_MANAGEMENT: {
            ROOT: "/admin/mutual-funds-management",
            ADD_NEW: "/admin/add-new-fund",
        },
        NOTIFICATIONS: "/admin/notifications",
        BOT_MANAGEMENT: "/admin/bot-management",
        ALGO_TRADING: "/admin/algo-trading",
        SUBSCRIPTIONS: "/admin/subscriptions",
        SETTINGS: "/admin/settings",
        SYSTEM_LOGS: "/admin/system-logs",
        SYSTEM_LOG_DETAIL: (id: string) => `/admin/system-logs/${id}`,
    }
} as const;
