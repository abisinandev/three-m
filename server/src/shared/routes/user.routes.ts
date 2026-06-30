export enum UserRoutes {
    PROFILE = "/profile/me",
    CHANGE_PASSWORD = "/change-password",
    LOGOUT = "/logout",
    KYC_SUBMIT = "/kyc/submit",
    PROFILE_UPDATE = '/profile',
    EMAIL_UPDATE_OTP_SEND = '/profile/email/otp',
    EMAIL_UPDATE_VERIFY = '/profile/email/otp/verify',
    UPLOAD_PROFILE_IMAGE = '/profile/avatar',
    WALLET = '/wallet',
    MF_FUND = "/:schemeCode",
    STOCKS = "/stocks"
}

export enum UserMutualFundRoutes {
    LISTS = "/lists",
    INVESTMENTS = "/investments",
    INVESTMENT_ONE_TIME = '/investments',
    FETCH_FUND_DETAILS = "/:schemeCode"
}

export enum UserSipRoutes {
    CREATE = "/",
    LIST = '/',
    PAUSE = '/:sipId/pause',
    RESUME = '/:sipId/resume',
    CANCEL = '/:sipId/cancel'
}

export enum UserPaymentRoutes {
    CREATE_CHECKOUT_SESSION = '/checkout',
    VERIFY = '/verify'
}

export enum UserWebhookRoutes {
    STRIPE = '/stripe'
}

export enum UserSubscriptionRoutes {
    GET_PREMIUM_PLAN = '/premium'
}

