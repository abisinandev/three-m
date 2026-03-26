export enum AdminAuthRoutes {
    AUTH = "/",
    VERIFY_OTP = "/verify-otp",
    REFRESH_API = "/refresh",
    RESEND_OTP = "/resend-otp",
}

export enum AdminProtectedRoutes {
    PROFILE = "/profile",
    LOGOUT = "/logout",

    FETCH_USER = "/users",
    BLOCK_USER = "/user/block/:userId",
    UNBLOCK_USER = "/user/unblock/:userId",

    FETCH_KYC_DATAS = "/kyc-management",
    VIEW_KYC_DETAILS = "/view-kyc/:kycId",
    VERIFY_KYC = "/verify-kyc/:kycId",
    REJECT_KYC = "/reject-kyc/:kycId",

    FETCH_TRANSACTIONS = "/transactions",
    VERIFY_TRANSACTIONS = "/transaction-verify/:txId",
}

export enum AdminStockRoutes {
    LIST_STOCKS = "/",
    UPDATE_STATUS = "/:symbol/status",
}

export enum AdminSipRoutes {
    LIST_ALL = '/',
    FETCH_DETAILS = '/:sipId',
    BLOCK_SIP = '/block/:sipId'
}

export enum AdminMutualFundRoutes {
    ADD_FUNDS = "/add-fund",
    LIST_FUNDS = "/list",
    UPDATE_STATUS = "/:fundId/status"
}
