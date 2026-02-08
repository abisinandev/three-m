export enum UserRoutes {
    PROFILE = "/profile/me",
    CHANGE_PASSWORD = "/change-password",
    LOGOUT = "/logout",
    KYC_SUBMIT = "/kyc/submit",
    PROFILE_UPDATE = '/profile/update',
    EMAIL_UPDATE_OTP_SEND = '/profile/update/email/send-otp',
    EMAIL_UPDATE_VERIFY = '/profile/update/email/verify-otp',
    UPLOAD_PROFILE_IMAGE = '/profile/update/profile-image',
    WALLET = '/wallet',
    MF_FUND = "/:schemeCode"
}

export enum UserMutualFundRoutes {
    LISTS = "/lists",
    INVESTMENTS = "/investments",
    INVESTMENT_ONE_TIME = '/investment/one-time',
    FETCH_FUND_DETAILS = "/:schemeCode"
}

export enum UserSipRoutes {
    CREATE = "/create",
    LIST = '/',
    PAUSE = '/pause/:sipId',
    RESUME = '/resume/:sipId',
    CANCEL = '/cancel/:sipId'
}

export enum UserPaymentRoutes {
    CREATE_CHECKOUT_SESSION = '/create-checkout-session'
}

export enum UserWebhookRoutes {
    STRIPE = '/stripe'
}
