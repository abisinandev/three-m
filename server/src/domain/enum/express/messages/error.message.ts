export enum ErrorMessage {
  USER_ALREADY_EXISTS = "User already exists",
  USER_NOT_FOUND = "User not found",
  INVALID_CREDENTIALS = "Invalid credentials",
  UNAUTHORIZED = "Unauthorized access",
  FORBIDDEN = "Access forbidden",
  VALIDATION_FAILED = "Validation failed",
  EMAIL_ALREADY_EXISTS = "Email already exists",
  PHONENO_ALREADY_EXISTS = "Phone number already exists",
  INTERNAL_SERVER_ERROR = "Internal server error",
  OTP_EXPIRED = "OTP expired or not found",
  INVALID_OTP = "Invalid OTP",
  ACCOUNT_BLOCKED = "Account is blocked",
  EMAIL_NOT_VERIFIED = "Email not verified",
  DB_CONNECTION_FAILED = "DATABASE_URI is not defined in .env",
  TWO_FA_REQUIRED = "2FA verification required",
  EMAIL_MUST_STRING = "Email must be a string",
  TWO_FA_NOT_CONFIGURED = "2FA not configured for this user",
  RESET_TOKEN_EXPIRED = "Reset token expired",
  RESET_TOKEN_INVALID = "RESET TOKEN IS INVALID",
  INVALID_PASSWORD = "Invalid old password",
  ADMIN_NOT_FOUND = "Admin not found",
  NOT_FOUND = 'Not found',

  REFRESH_TOKEN_MISSING = "Refresh token is missing",
  REFRESH_TOKEN_EXPIRED = "Invalid or expired refresh token",
  REFRESH_TOKEN_NOT_FOUND = "Refresh token not found or already revoked",

  RATE_LIMIT_MESSAGE = "Please wait 30 seconds before requesting another OTP",
  MAX_RESEND_REACHED = "Maximum resend attempts reached",

  EMAIL_NOT_VERIFIED_BY_GOOGLE = "Email not verified by Google",

  USER_ALREADY_BLOCKED = "User already blocked",
  USER_ALREADY_UNBLOCKED = "User already unblocked",

  ACCOUNT_BLOCKED_ADMIN = "Account is blocked",

  PROFILE_UPDATION_FAILED = "No valid fields provided to update",

  WALLET_NOT_FOUND = "Wallet not found",

  USER_NOT_VERIFIED = "User not verified",
  WALLET_BALANCE_EXCEEDED = "Wallet balance cannot exceed ₹50,000.",

  TRANSACTION_FAILED = "Transaction verification failed",
  ALREADY_EXISTS = "Already exists",

  INSUFFICIENT_BALANCE = "Insufficient balance",

  FUND_INACTIVE = "Investments in this fund are temporarily disabled. Please try another fund",
  REDEMPTION_FAILED = "Redemption is not allowed for this fund at the moment",
  FUND_CLOSED = "Fund is closed for redemption",
  FUND_SUSPENDED = "Redemption is temporarily suspended",
  NO_REDEEMABLE_UNITS = "No redeemable units are available for the selected scheme.",

  NAV_NOT_AVAILABLE = "Net Asset Value (NAV) is currently unavailable for the selected scheme.",
  NOT_ENOUGH_UNITS = "Insufficient units to complete the transaction.",
  NOT_ENOUGH_AMOUNT = "Insufficient amount to complete the transaction.",
  INVALID_REDEEM_REQUEST = "The redemption request is invalid. Please verify the details and try again."
}
