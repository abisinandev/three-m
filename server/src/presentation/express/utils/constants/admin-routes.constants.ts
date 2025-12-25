export enum AUTH_ROUTES {
  AUTH = "/",
  VERIFY_OTP = "/verify-otp",
  REFRESH_API = "/refresh",
  RESEND_OTP = "/resend-otp",
}

export enum PROTECTED_ROUTES {
  PROILE = "/profile",
  LOGOUT = "/logout",

  FETCH_USER = "/users",
  BLOCK_USER = "/user/block/:userId",
  UNBLOCK_USER = "/user/unblock/:userId",

  FETCH_KYC_DATAS = "/kyc-management",
  VIEW_KYC_DETAILS = "/view-kyc/:kycId",
  VERIFY_KYC = "/verify-kyc/:kycId",
  REJECT_KYC = "/reject-kyc/:kycId",

  FETCH_TRANSACTIONS = "/transactions",
  VERIFY_TRANSACTIONS = "/transaction-verify/:txId"
}
