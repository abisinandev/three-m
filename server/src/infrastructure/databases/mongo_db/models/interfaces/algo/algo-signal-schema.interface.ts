import { SignalAction, SignalStatus } from "@domain/entities/algo/enum/signal-enums";
import { Types } from "mongoose";

export interface IAlgoSignalSchema {
    _id: Types.ObjectId;
    userId: Types.ObjectId;
    algoId: Types.ObjectId;
    symbol: string;
    action: SignalAction;
    strategyName: string;
    price: number;
    reason: string;
    status: SignalStatus;
    createdAt: Date;
    expiresAt: Date;
}