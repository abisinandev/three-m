export interface AlgoStrategyResponseDTO {
    id: string;
    userId: string;
    symbol: string;
    strategyName: string;
    config: Record<string, unknown>;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    usersCount?: number;
    lastSignalTime?: Date | null;
}
