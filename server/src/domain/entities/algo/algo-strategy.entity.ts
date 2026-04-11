export class AlgoStrategyEntity {
  private readonly _id?: string | null;
  private readonly _userId: string;
  private readonly _symbol: string;
  private readonly _strategyName: string;
  private readonly _config: any;
  private _isActive: boolean;
  private readonly _createdAt: Date;
  private readonly _updatedAt: Date;

  private constructor(props: {
    id?: string | null;
    userId: string;
    symbol: string;
    strategyName: string;
    config: any;
    isActive: boolean;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    this._id = props.id ?? null;
    this._userId = props.userId;
    this._symbol = props.symbol;
    this._strategyName = props.strategyName;
    this._config = props.config;
    this._isActive = props.isActive;
    this._createdAt = props.createdAt ?? new Date();
    this._updatedAt = props.updatedAt ?? new Date();
  }

  static create(data: {
    userId: string;
    symbol: string;
    strategyName: string;
    config: any;
    isActive?: boolean;
  }): AlgoStrategyEntity {
    return new AlgoStrategyEntity({
      userId: data.userId,
      symbol: data.symbol,
      strategyName: data.strategyName,
      config: data.config,
      isActive: data.isActive ?? true,
    });
  }

  static fromPersistence(data: {
    id: string;
    userId: string;
    symbol: string;
    strategyName: string;
    config: any;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  }): AlgoStrategyEntity {
    return new AlgoStrategyEntity({
      id: data.id,
      userId: data.userId,
      symbol: data.symbol,
      strategyName: data.strategyName,
      config: data.config,
      isActive: data.isActive,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }

  get id() { return this._id; }
  get userId() { return this._userId; }
  get symbol() { return this._symbol; }
  get strategyName() { return this._strategyName; }
  get config() { return this._config; }
  get isActive() { return this._isActive; }
  get createdAt() { return this._createdAt; }
  get updatedAt() { return this._updatedAt; }

  toggleActive(isActive: boolean) {
    this._isActive = isActive;
  }

  toPersistence() {
    return {
      id: this._id,
      userId: this._userId,
      symbol: this._symbol,
      strategyName: this._strategyName,
      config: this._config,
      isActive: this._isActive,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }
}
