export enum AlgoTradingRoutes {
    BASE_ROUTE = '/api/user/stock/algo-trading',
    GET_STRATEGIES = '/strategies',
    SAVE_STRATEGY = '/strategy',
    TOGGLE_STRATEGY_STATUS = '/toggle-status/:strategyId',
    GET_ACTIVE_STRATEGY = '/active/:symbol',
    CONFIRM_SIGNAL = '/confirm-signal'
}
