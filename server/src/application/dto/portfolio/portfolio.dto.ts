export interface PortfolioDTO {
    id?: string;
    userId: string;
    symbol: string;
    quantity: number;
    avgPrice: number;
    investedAmount: number;
    createdAt?: Date;
    updatedAt?: Date;
}
