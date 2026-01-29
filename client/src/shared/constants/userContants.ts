// BACKEND ENDPOINTS
export const SIGNUP_API = "/auth/signup";
export const LOGIN_API = "/auth/login";
export const VERIFY_OTP = "/auth/verify-otp";
export const RESEND_OTP = "/auth/resend-otp";
export const FORGOT_PASSWORD = "/auth/forgot-password"
export const FORGOT_PASSWORD_VERIFY = "/auth/forgot-password/verify-otp";
export const FORGOT_PASSWORD_RESEND = "/auth/forgot-password/resend-otp";
export const RESET_PASSWORD = "/auth/reset-password";
export const LOGOUT = '/user/logout';
export const GOOGLE_AUTH = '/auth/google/callback';
export const CHANGE_PASSWORD = "/user/change-password";
export const PROFILE_GET_API = '/user/profile/me';

export const USER_REFRESH_TOKEN = "/auth/refresh";

export const FILE_UPLOAD_SIGN_URL = '/file-upload/cloudinary/signature';
export const KYC_SUMBIT_URL = '/user/kyc/submit';

export const UPDATE_PROFILE = "/user/profile/update";
export const SEND_EMAIL_OTP = "/user/profile/update/email/send-otp";
export const VERIFY_EMAIL_OTP = '/user/profile/update/email/verify-otp';
export const UPLOAD_PROFILE_IMAGE = "/user/profile/update/profile-image";

export const PAYMENT_ROUTE = "/payments/create-checkout-session";
