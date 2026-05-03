export interface ConfirmBotOrderDTO {
    userId: string;
    symbol: string;
    quantity: number;
}

export interface IConfirmBotBuyOrderUseCase {
    execute(order: ConfirmBotOrderDTO): Promise<void | { message: string, upgrade: boolean }>;
}