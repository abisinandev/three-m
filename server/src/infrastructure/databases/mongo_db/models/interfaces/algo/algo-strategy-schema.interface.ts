import type { Types } from "mongoose";

export interface IAlgoStrategySchema {
  _id: Types.ObjectId;
  userId: string;
  symbol: string;
  strategyName: string;
  config: any;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
