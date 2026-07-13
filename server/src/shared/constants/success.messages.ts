export const SuccessMessages = {
    AUTH: {
        REGISTERED: "User registered successfully",
        LOGGED_IN: "Logged in successfully",
        LOGGED_OUT: "Logged out successfully",
        EMAIL_VERIFIED: "Email verified successfully. You can now log in",
        EMAIL_SENT: "Email sent successfully",
        PASSWORD_CHANGED: "Password changed successfully",
        PASSWORD_RESET: "Password reset successfully",
        OTP_SENT: "OTP sent to email. Please check your inbox to verify your email and activate your account",
        OTP_VERIFIED: "OTP verified. You can now reset your password",
        RESEND_OTP: "New OTP sent to your email",
        VERIFICATION_CODE_SENT: "Verification code sent to your email, please verify",
        ACCOUNT_EXISTS_NOT_VERIFIED: "Account exists but not verified. OTP resent to your email",
        TWO_FA_VERIFIED: "2-Factor-Authentication verified",
        TWO_FA_REQUIRED: "2FA setup required",
        VERIFY_2FA_CODE: "Please verify your 2FA code",
        ACCESS_TOKEN_UPDATED: "Access token refreshed successfully",
        AUTHENTICATION_DONE: "Authentication successfully done",
    },
    USER: {
        UPDATED: "User updated successfully",
        DELETED: "User deleted successfully",
        BLOCKED: "User blocked successfully",
        UNBLOCKED: "User unblocked successfully",
        KYC_VERIFIED: "KYC verified successfully",
        KYC_REJECTED: "KYC document rejected",
        PROFILE_UPDATED: "Profile updated successfully",
        PROFILE_IMAGE_ADDED: "Profile image added",
        EMAIL_UPDATE_OTP_SENT: "OTP sent to email. Please check your inbox to verify your email",
        EMAIL_UPDATED: "Email updated successfully",
        KYC_SUBMITTED: "Kyc submission successful"
    },
    DATA: {
        FETCHED: "Data fetched successfully",
        SAVED: "Data saved successfully",
        UPDATED: "Data updated successfully",
        DELETED: "Data deleted successfully",
        OPERATION_SUCCESSFUL: "Operation completed successfully",
        UPLOAD_SUCCESS: "File upload completed",
    },
    PAYMENT: {
        TRANSACTION_VERIFIED: "Transaction verified",
        INVESTMENT_SUCCESS: "Investment successfully done",
        VERIFIED: "Payment verified successfully",
        SESSION_EXPIRED: "Session expired",
        SESSION_CREATED: "Checkout session created successfully"
    },
    SIP: {
        PAUSED: "SIP paused",
        RESUMED: "SIP resumed",
        CANCELLED: "SIP cancelled",
        UPGRADE_PREMIUM: "Upgrade to Premium to use SIP investment feature",
    },
    MUTUAL_FUND: {

    },
    NOTIFICATION: {
        MARK_AS_READ: "Notification marked as read",
    },

    STOCK: {
        STOCK_FETCHED: "Stocks fetched successfully",
        SELL_ORDER: "Sell order done successfully",
        BUY_ORDER: "Buy order received successfully",
        LIMIT_ORDER_PLACED: "Limit order placed successfully. It will execute when price conditions are met.",
        LIMIT_ORDER_CANCELLED: "Limit order cancelled successfully",
    },

    ALGO: {
        STRATEGY_SAVED: "Strategy saved successfully",
        STRATEGY_ACTIVATED: "Strategy activated successfully",
        STRATEGY_DEACTIVATED: "Strategy deactivated successfully",
        STRATEGY_FETCHED: "Strategies fetched successfully",
        ACTIVE_STRATEGY_FETCHED: "Active strategy fetched successfully",
        SIGNAL_CONFIRMED: "Signal confirmed and order placed successfully",
        SIGNAL_NOT_FOUND: "Signal not found. It may have already been processed.",
    },

    SUBSCRIPTION: {
        UPGRADE_PREMIUM: "Upgrade to Premium to use this feature",
        PLAN_UPDATED: "Plan updated successfully",
    },

    AI_CHATBOT: {
        DATA: "Responded successfully",
        UPGRADE_PLAN: "Upgrade to Premium to unlock full AI capabilities.",
    },

} as const;
