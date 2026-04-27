export const API_ROUTES = {
    USER: {
        AUTH: {
            SIGNUP: "/auth/signup",
            LOGIN: "/auth/login",
            VERIFY_OTP: "/auth/verify-otp",
            RESEND_OTP: "/auth/resend-otp",
            FORGOT_PASSWORD: "/auth/forgot-password",
            FORGOT_PASSWORD_VERIFY: "/auth/forgot-password/verify-otp",
            FORGOT_PASSWORD_RESEND: "/auth/forgot-password/resend-otp",
            RESET_PASSWORD: "/auth/reset-password",
            REFRESH_TOKEN: "/auth/refresh",
            GOOGLE_AUTH: "/auth/google/callback",
            TWO_FACTOR_VERIFY: (email: string) => `/auth/two-factor-verify?email=${encodeURIComponent(email)}`,
        },
        PROFILE: {
            GET: "/user/profile/me",
            UPDATE: "/user/profile/update",
            CHANGE_PASSWORD: "/user/change-password",
            SEND_EMAIL_OTP: "/user/profile/update/email/send-otp",
            VERIFY_EMAIL_OTP: "/user/profile/update/email/verify-otp",
            UPLOAD_IMAGE: "/user/profile/update/profile-image",
            LOGOUT: "/user/logout",
        },
        KYC: {
            SUBMIT: "/user/kyc/submit",
        },
        FILE_UPLOAD: {
            SIGN_URL: "/file-upload/cloudinary/signature",
        },
        WALLET: {
            GET: "/user/wallet",
        },
        PAYMENT: {
            CHECKOUT_SESSION: "/payments/create-checkout-session",
            VERIFY: "/payments/verify",
        },
        NOTIFICATIONS: {
            GET_ALL: "/notifications",
            MARK_READ: (id: string) => `/notifications/${id}/read`,
            MARK_ALL_READ: "/notifications/read-all",
        },
        MARKET_NEWS: {
            GET_ALL: "/market-news",
        },
        PORTFOLIO: {
            GET_INVESTMENTS: "/user/portfolio",
            GET_SUMMARY: "/user/portfolio/summary",
            REDEEM_INVESTMENT: "/user/portfolio/redeem-investment",
            CONFIRM_REDEEM: "/user/portfolio/confirm-redeem",
            PROJECTION: "/user/portfolio/projection",
            TRADE_HISTORY: "/user/portfolio/history",
            INVESTMENTS: "/user/portfolio/investments",
            TRADES: "/user/portfolio/trades",
            HISTORIES: "/user/portfolio/histories",
            GET_ASSETS: "/user/portfolio/assets",
            GET_MF_ASSETS: "/user/portfolio/assets/mf",
            GET_STOCK_ASSETS: "/user/portfolio/assets/stock",
        },
        MUTUAL_FUNDS: {
            LIST: "/user/mutual-funds/lists",
            DETAILS: (schemeCode: string | number) => `/user/mutual-funds/${schemeCode}`,
            INVEST_ONE_TIME: "/user/mutual-funds/investment/one-time",
            START_SIP: "/user/mutual-funds/sip/create",
            FETCH_SIPS: "/user/mutual-funds/sip",
            PAUSE_SIP: (sipId: string) => `/user/mutual-funds/sip/pause/${sipId}`,
            RESUME_SIP: (sipId: string) => `/user/mutual-funds/sip/resume/${sipId}`,
            CANCEL_SIP: (sipId: string) => `/user/mutual-funds/sip/cancel/${sipId}`,
        },
        STOCKS: {
            GET_ALL: "/user/stocks",
            WATCHLIST: "/user/stocks/all/watchlist",
        }
    },
    ADMIN: {
        AUTH: {
            LOGIN: "/authentication",
            VERIFY_OTP: "/authentication/verify-otp",
            RESEND_OTP: "/authentication/resend-otp",
            REFRESH_TOKEN: "/authentication/refresh",
            LOGOUT: "/logout",
        },
        USERS: {
            FETCH_ALL: "/users",
            BLOCK: (id: string) => `/user/block/${id}`,
            UNBLOCK: (id: string) => `/user/unblock/${id}`,
            PROFILE: "/profile",
        },
        TRANSACTIONS: {
            GET_ALL: "/transactions",
        },
        KYC: {
            GET_ALL: "/kyc-management",
            VIEW: (kycId: string) => `/view-kyc/${kycId}`,
            APPROVE: (kycId: string) => `/verify-kyc/${kycId}`,
            REJECT: (kycId: string) => `/reject-kyc/${kycId}`,
        },
        MUTUAL_FUNDS: {
            ADD: "/mutual-funds/add-fund",
            LIST: "/mutual-funds/list",
            UPDATE_STATUS: (id: string | number) => `/mutual-funds/${id}/status`,
        },
        SIP: {
            GET_ALL: "/sip-management",
            DETAILS: (sipId: string) => `/sip-management/${sipId}`,
        },
        STOCKS: {
            GET_ALL: "/stocks",
            UPDATE_STATUS: (symbol: string) => `/stocks/${symbol}/status`,
        },
        ALGO_TRADING: {
            GET_STATS: "/algo-trading",
            GET_STRATEGIES: "/algo-trading/strategies",
            GET_SIGNALS: "/algo-trading/signals",
            GET_TRADES: "/algo-trading/trades",
        }
    },
    CHATBOT: {
        CHAT: "/bot/chat",
        HISTORY: "/bot/history",
    },
} as const;
