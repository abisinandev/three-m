
export interface IProcessStripePaymentUseCase {
    execute(sessionId: string): Promise<{
        success: boolean;
        message?: string;
        amount?: number;
        purpose?: string;
    }>;
}