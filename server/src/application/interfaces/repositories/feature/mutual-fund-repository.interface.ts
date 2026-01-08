import { MutualFundEntity } from "@domain/entities/mutual-fund/mutual-fund-entity";
import { ClientSession, QueryOptions } from "mongoose";
import { IBaseRepository } from "../base-repository.interface";

export interface IMutualFundRepository extends IBaseRepository<MutualFundEntity> {
    findAllFunds(options: QueryOptions): Promise<MutualFundEntity[]>;
    createFund(entity: MutualFundEntity, session?: ClientSession): Promise<void>;
    findBySchemeCode(schemeCode: string): Promise<MutualFundEntity | null>;
    saveFunds(date: Date, nav: number): Promise<void>;
    findActiveFunds(): Promise<{ funds: MutualFundEntity[], countActiveFunds: number }>;
    findInactiveFunds(): Promise<{ funds: MutualFundEntity[], countInactiveFunds: number }>;
}