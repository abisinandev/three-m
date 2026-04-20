import { ClientSession } from "mongoose";
import { PortfolioEntity } from "@domain/entities/portfolio/portfolio.entity";
import { IBaseRepository } from "../base-repository.interface";
import { QueryOptions } from "mongoose";

export interface IPortfolioRepository extends IBaseRepository<PortfolioEntity> {
    findByUserIdAndSymbol(userId: string, assetId: string, session?: ClientSession): Promise<PortfolioEntity | null>;
    findByUserId(userId: string, session?: ClientSession): Promise<PortfolioEntity[]>;
    findWithFilters(userId: string, options: QueryOptions): Promise<PortfolioEntity[]>;
    countWithFilters(userId: string, filter: Record<string, unknown>, search: string): Promise<number>;
    deleteByUserIdAndSymbol(userId: string, assetId: string, session?: ClientSession): Promise<boolean>;
}
