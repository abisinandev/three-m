export const ErrorMessages = {
    AUTH: {
        USER_ALREADY_EXISTS: "User already exists",
        USER_NOT_FOUND: "User not found",
        INVALID_CREDENTIALS: "Invalid credentials",
        UNAUTHORIZED: "Unauthorized access",
        FORBIDDEN: "Access forbidden",
        OTP_EXPIRED: "OTP expired or not found",
        INVALID_OTP: "Invalid OTP",
        TWO_FA_REQUIRED: "2FA verification required",
        TWO_FA_NOT_CONFIGURED: "2FA not configured for this user",
        REFRESH_TOKEN_MISSING: "Refresh token is missing",
        REFRESH_TOKEN_EXPIRED: "Invalid or expired refresh token",
        REFRESH_TOKEN_NOT_FOUND: "Refresh token not found or already revoked",
        RATE_LIMIT_MESSAGE: "Please wait 30 seconds before requesting another OTP",
        MAX_RESEND_REACHED: "Maximum resend attempts reached",
        EMAIL_NOT_VERIFIED: "Email not verified",
        EMAIL_NOT_VERIFIED_BY_GOOGLE: "Email not verified by Google",
        RESET_TOKEN_EXPIRED: "Reset token expired",
        RESET_TOKEN_INVALID: "Reset token is invalid",
        INVALID_OLD_PASSWORD: "Invalid old password",
        COMPLETE_KYC: "Please complete KYC verification",
    },
    USER: {
        ACCOUNT_BLOCKED: "Account is blocked",
        ALREADY_BLOCKED: "User already blocked",
        ALREADY_UNBLOCKED: "User already unblocked",
        NOT_FOUND: "User not found", // Specific user not found
        NOT_VERIFIED: "User not verified",
        PROFILE_UPDATE_FAILED: "No valid fields provided to update",
        KYC_REJECTED: "KYC document rejected",
    },
    VALIDATION: {
        FAILED: "Validation failed",
        EMAIL_ALREADY_EXISTS: "Email already exists",
        PHONE_ALREADY_EXISTS: "Phone number already exists",
        EMAIL_MUST_BE_STRING: "Email must be a string",
    },
    DB: {
        CONNECTION_FAILED: "Database URI is not defined",
        DATA_NOT_FOUND: "Data not found",
        ALREADY_EXISTS: "Already exists",
    },
    SERVER: {
        INTERNAL_ERROR: "Internal server error",
    },
    ADMIN: {
        NOT_FOUND: "Admin not found",
    },
    PAYMENT: {
        WALLET_NOT_FOUND: "Wallet not found",
        WALLET_BALANCE_EXCEEDED: "Wallet balance cannot exceed ₹50,000",
        INSUFFICIENT_BALANCE: "Insufficient balance",
        TRANSACTION_FAILED: "Transaction verification failed",
        EXTERNAL_VERIFICATION_ONLY: "External transaction only allowed to verify",
        LIMIT_EXCEEDED: "Transaction amount exceeds the allowed limit of ₹10,000",
        INVALID_AMOUNT: "Invalid amount",
    },
    MUTUAL_FUND: {
        FUND_INACTIVE: "Investments in this fund are temporarily disabled. Please try another fund",
        REDEMPTION_FAILED: "Redemption is not allowed for this fund at the moment",
        FUND_CLOSED: "Fund is closed for redemption",
        FUND_SUSPENDED: "Redemption is temporarily suspended",
        NO_REDEEMABLE_UNITS: "No redeemable units are available for the selected scheme",
        NAV_NOT_AVAILABLE: "Net Asset Value (NAV) is currently unavailable for the selected scheme",
        NOT_ENOUGH_UNITS: "Insufficient units to complete the transaction",
        NOT_ENOUGH_AMOUNT: "Insufficient amount to complete the transaction",
        INVALID_REDEEM_REQUEST: "The redemption request is invalid. Please verify the details and try again",
    },
    EXPENSE_TRACKER: {
        INSUFFICIENT_BALANCE : "Insufficient funds: You don't have enough balance to add this expense."
    }
} as const;
