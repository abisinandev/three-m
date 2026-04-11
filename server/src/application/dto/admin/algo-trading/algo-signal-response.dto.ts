export interface AdminAlgoSignalResponseDTO {
    id: string;
    userId: string;
    symbol: string;
    strategyName: string;
    action: string;
    price: number;
    reason: string;
    status: string;
    createdAt: Date;
    expiresAt: Date;
}
