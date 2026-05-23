export interface ConfirmSignalDTO {
    userId: string;
    notificationId: string;
    signalId: string;
    symbol: string;
    action: "BUY" | "SELL";
    quantity: number;
    stopLoss?: number;
    takeProfit?: number;
}