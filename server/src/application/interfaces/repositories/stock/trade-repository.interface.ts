import { TradeEntity } from "@domain/entities/stock/trade.entity";
import { IBaseRepository } from "../base-repository.interface";
import { ClientSession } from "mongoose";

export interface ITradeRepository extends IBaseRepository<TradeEntity> {
  findByUserId(userId: string, session?: ClientSession): Promise<TradeEntity[]>;
  findByOrderId(orderId: string, session?: ClientSession): Promise<TradeEntity[]>;
}
