export interface AdminAlgoTradingResponseDTO {
    activeStrategiesCount: number;
    activeSignalsCount: number;
    tradesExecutedTodayCount: number;
    failedTradesCount: number;
    marketStatus: "OPEN" | "CLOSED";
}
