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
            TWO_FACTOR_VERIFY: "/auth/two-factor-verify",
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
            DETAILS: (schemeCode: string | number) =>
                `/user/mutual-funds/${schemeCode}`,
            INVEST_ONE_TIME: "/user/mutual-funds/investment/one-time",
            START_SIP: "/user/mutual-funds/sip/create",
            FETCH_SIPS: "/user/mutual-funds/sip",
            PAUSE_SIP: (sipId: string) =>
                `/user/mutual-funds/sip/pause/${sipId}`,
            RESUME_SIP: (sipId: string) =>
                `/user/mutual-funds/sip/resume/${sipId}`,
            CANCEL_SIP: (sipId: string) =>
                `/user/mutual-funds/sip/cancel/${sipId}`,
        },

        STOCKS: {
            GET_ALL: "/user/stocks",
            WATCHLIST: "/user/stocks/all/watchlist",
            DETAILS: (symbol: string) => `/user/stocks/${symbol}`,
            CANDLES: (symbol: string) =>
                `/user/stocks/${symbol}/candles`,
            MARKET_MOVERS: "/user/stocks/market/movers",
            ORDER_HISTORY: "/user/stocks/orders/history",

            ORDERS: {
                BUY: (symbol: string) =>
                    `/user/stock/order/${symbol}/buy`,
                SELL: (symbol: string) =>
                    `/user/stock/order/${symbol}/sell`,
                LIMIT_BUY: (symbol: string) =>
                    `/user/stock/order/${symbol}/limit-buy`,
                LIMIT_SELL: (symbol: string) =>
                    `/user/stock/order/${symbol}/limit-sell`,
                PENDING: "/user/stock/order/pending",
                CANCEL: (symbol: string, orderId: string) =>
                    `/user/stock/order/${symbol}/cancel/${orderId}`,
            },
        },

        ALGO_TRADING: {
            CONFIRM_SIGNAL: "/user/stock/algo-trading/confirm-signal",
        },

        DASHBOARD: {
            OVERVIEW: "/user/dashboard/overview",
        },

        SUBSCRIPTIONS: {
            PREMIUM: "/user/subscriptions/premium",
        },

        EXPENSE_TRACKER: {
            GET_DATA: "/user/expense-tracker",
            ADD_EXPENSE: "/user/expense-tracker/add-expense",
            ADD_INCOME: "/user/expense-tracker/add-income",
            DELETE_EXPENSE: (id: string | number) =>
                `/user/expense-tracker/delete-expense/${id}`,
            ANALYTICS: "/user/expense-tracker/analytics",
            BUDGET_PLAN: "/user/expense-tracker/budget-plan",
            SIMULATE: "/user/expense-tracker/simulate",
        },
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
            UPDATE_STATUS: (id: string | number) =>
                `/mutual-funds/${id}/status`,
        },

        SIP: {
            GET_ALL: "/sip-management",
            DETAILS: (sipId: string) => `/sip-management/${sipId}`,
        },

        STOCKS: {
            GET_ALL: "/stocks",
            UPDATE_STATUS: (symbol: string) =>
                `/stocks/${symbol}/status`,
            SEARCH: "/stocks/search",
            ADD: "/stocks/add",
        },

        ALGO_TRADING: {
            BASE: "/trade",
            GET_STATS: "/trade",
            GET_STRATEGIES: "/trade/strategies",
            GET_SIGNALS: "/trade/signals",
            GET_TRADES: "/trade/trades",
            GET_ALL_TRADES: "/trade/all-trades",
        },

        SYSTEM_MANAGEMENT: {
            LOGS: "/system/logs",
        },
    },

    CHATBOT: {
        CHAT: "/bot/chat",
        HISTORY: "/bot/history",
        CONFIRM_ORDER: "/bot/confirm-order",
    },
} as const;


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
            DETAILS: (schemeCode: string | number) =>
                `/user/mutual-funds/${schemeCode}`,
        },

        PAYMENT: {
            SUCCESS: "/user/payment-success",
            FAILED: "/user/payment-failed",
        },

        TRADING: "/user/stocks",

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

        LOGOUT: "/user/logout",
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

        TRADES_MANAGEMENT: "/admin/trades",

        SUBSCRIPTIONS: "/admin/subscriptions",

        SETTINGS: "/admin/settings",

        SYSTEM_LOGS: "/admin/system-logs",

        SYSTEM_LOG_DETAIL: (id: string) =>
            `/admin/system-logs/${id}`,
    },
} as const;