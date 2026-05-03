import { ClientSession, QueryOptions } from "mongoose";
import { PortfolioEntity } from "@domain/entities/portfolio/portfolio.entity";
import { IBaseRepository } from "../base-repository.interface";
import { PortfolioStockDTO } from "@application/dto/portfolio/aggregated-asset.dto";

export interface IPortfolioRepository extends IBaseRepository<PortfolioEntity> {
    findByUserIdAndSymbol(userId: string, assetId: string, session?: ClientSession): Promise<PortfolioEntity | null>;
    findByUserId(userId: string, session?: ClientSession): Promise<PortfolioEntity[]>;
    findWithFilters(userId: string, options: QueryOptions): Promise<PortfolioStockDTO[]>;
    countWithFilters(userId: string, filter: Record<string, unknown>, search: string): Promise<number>;
    deleteByUserIdAndSymbol(userId: string, assetId: string, session?: ClientSession): Promise<boolean>;
    getUserAssets(userId: string): Promise<PortfolioEntity[]>;
    countUserInvestements(userId: string): Promise<number>;
    countUserStockHoldings(userId: string): Promise<number>;
}
