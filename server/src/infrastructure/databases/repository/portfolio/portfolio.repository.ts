import { BaseRepository } from "../base.repository";
import { PortfolioEntity } from "@domain/entities/portfolio/portfolio.entity";
import { IPortfolioRepository } from "@application/interfaces/repositories/feature/portfolio-repository.interface";
import { PortfolioModel, PortfolioDocument } from "../../mongo_db/models/schemas/portfolio/portfolio.schema";
import { injectable } from "inversify";
import { PortfolioMapper } from "@infrastructure/mappers/portfolio/portfolio.mapper";
import { ClientSession } from "mongoose";

@injectable()
export class PortfolioRepository extends BaseRepository<PortfolioEntity, PortfolioDocument> implements IPortfolioRepository {
    constructor() {
        super(PortfolioModel, PortfolioMapper)
    }

    async findByUserIdAndSymbol(userId: string, symbol: string, session?: ClientSession): Promise<PortfolioEntity | null> {
        const result = await this.model.findOne({ userId, symbol }, null, { session });
        if (!result) return null;
        return this.mapper.toDomain(result);
    }

    async findByUserId(userId: string, session?: ClientSession): Promise<PortfolioEntity[]> {
        const results = await this.model.find({ userId }, null, { session });
        return results.map((doc) => this.mapper.toDomain(doc))
    }

    async deleteByUserIdAndSymbol(userId: string, symbol: string, session?: ClientSession): Promise<boolean> {
        const result = await this.model.deleteOne({ userId, symbol }, { session });
        return result.deletedCount > 0;
    }
}
