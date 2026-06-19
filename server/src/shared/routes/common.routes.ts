export enum CommonRoutes {
    //Wehooks main route
    WEBHOOK_ROUTE = '/api/payments/webhooks',

    //Cloudinary singature
    FILE_SIGNATURE = "/cloudinary/signature",

    // Mutual funds
    ADD_FUNDS = "/add-fund",
    ADD_FUND_ICON = "/add-fund-logo",

    //Expense-Tracker 
    EXPENSE_TRACKER = "/expense-tracker"
}

export enum MarketNewsRoutes {
    LIST = "/"
}

export enum BaseRoutes {
    AUTH = "/api/auth",
    ADMIN_AUTH = "/api/admin/authentication",
    USER_EXPENSE_TRACKER = "/api/user/expense-tracker",
    USER_SIP = "/api/user/mutual-funds/sip",
    USER_MUTUAL_FUNDS = "/api/user/mutual-funds",
    USER_PORTFOLIO = "/api/user/portfolio",
    NOTIFICATIONS = "/api/notifications",
    USER_DASHBOARD = "/api/user/dashboard",
    USER = "/api/user",
    USER_SUBSCRIPTIONS = "/api/user/subscriptions",
    BOT = "/api/bot",
    ADMIN_MUTUAL_FUNDS = "/api/admin/mutual-funds",
    ADMIN_SIP = "/api/admin/sip-management",
    PAYMENTS = "/api/payments",
    ADMIN_DASHBOARD = "/api/admin/dashboard",
    ADMIN = "/api/admin",
    MARKET_NEWS = "/api/market-news",
    FILE_UPLOAD = "/api/file-upload",
    ADMIN_STOCKS = "/api/admin/stocks",
    USER_STOCKS = "/api/user/stocks",
    USER_STOCK_ORDER = "/api/user/stock/order",
    ALGO_TRADING = "/api/user/stock/algo-trading",
    ADMIN_TRADES = "/api/admin/trade",
    ADMIN_SUBSCRIPTIONS = "/api/admin/subscriptions",
    ADMIN_SYSTEM = "/api/admin/system"
}
