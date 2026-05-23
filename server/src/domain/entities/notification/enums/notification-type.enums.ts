export enum NotificationType {
    EXPENSE_TRACKER = "EXPENSE",
    WALLET = "WALLET",
    SIP = "SIP",
    MUTUAL_FUND = "MUTUAL_FUND",
    INFO = "INFO",
    WARNING = "WARNING",
    ALGO_SIGNAL = 'ALGO_SIGNAL'
}

export type NotificationData = Record<string, string | number | boolean | undefined>;
