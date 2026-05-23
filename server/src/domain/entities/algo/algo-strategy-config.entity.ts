export interface AlgoStrategyRiskConfigProps {
    id?: string;
    strategyName: string;
    riskAmount: number;
    maxTradesPerDay: number;
    stopLoss: number;
    takeProfit: number;
    updatedAt?: Date;
}

export class AlgoStrategyRiskConfig {
    private readonly _id?: string;
    private readonly _strategyName: string;
    private readonly _riskAmount: number;
    private readonly _maxTradesPerDay: number;
    private readonly _stopLoss: number;
    private readonly _takeProfit: number;
    private readonly _updatedAt?: Date;

    private constructor(props: AlgoStrategyRiskConfigProps) {
        this._id = props.id;
        this._strategyName = props.strategyName;
        this._riskAmount = props.riskAmount;
        this._maxTradesPerDay = props.maxTradesPerDay;
        this._stopLoss = props.stopLoss;
        this._takeProfit = props.takeProfit;
        this._updatedAt = props.updatedAt;
    }

    public static create(props: AlgoStrategyRiskConfigProps): AlgoStrategyRiskConfig {
        return new AlgoStrategyRiskConfig(props);
    }

    public static fromPersistence(props: AlgoStrategyRiskConfigProps): AlgoStrategyRiskConfig {
        return new AlgoStrategyRiskConfig(props);
    }

    get id(): string | undefined { return this._id; }
    get strategyName(): string { return this._strategyName; }
    get riskAmount(): number { return this._riskAmount; }
    get maxTradesPerDay(): number { return this._maxTradesPerDay; }
    get stopLoss(): number { return this._stopLoss; }
    get takeProfit(): number { return this._takeProfit; }
    get updatedAt(): Date | undefined { return this._updatedAt; }

    public toJSON() {
        return {
            id: this._id,
            strategyName: this._strategyName,
            riskAmount: this._riskAmount,
            maxTradesPerDay: this._maxTradesPerDay,
            stopLoss: this._stopLoss,
            takeProfit: this._takeProfit,
            updatedAt: this._updatedAt
        };
    }
}
