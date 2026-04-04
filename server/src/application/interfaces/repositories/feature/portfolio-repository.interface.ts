import { ClientSession } from "mongoose";
import { PortfolioEntity } from "@domain/entities/portfolio/portfolio.entity";
import { IBaseRepository } from "../base-repository.interface";

export interface IPortfolioRepository extends IBaseRepository<PortfolioEntity> {
    findByUserIdAndSymbol(userId: string, symbol: string, session?: ClientSession): Promise<PortfolioEntity | null>;
    findByUserId(userId: string, session?: ClientSession): Promise<PortfolioEntity[]>;
    deleteByUserIdAndSymbol(userId: string, symbol: string, session?: ClientSession): Promise<boolean>;
}
