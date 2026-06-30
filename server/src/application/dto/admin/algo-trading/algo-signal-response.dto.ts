export interface AdminAlgoSignalResponseDTO {
    symbol: string;
    strategyName: string;
    action: string;
    price: number;
    reason: string;
    status: string;
    createdAt: Date;
    expiresAt: Date;
}
