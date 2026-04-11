export interface AlgoStrategyResponseDTO {
    id: string;
    userId: string;
    symbol: string;
    strategyName: string;
    config: any;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    usersCount?: number;
    lastSignalTime?: Date | null;
}
