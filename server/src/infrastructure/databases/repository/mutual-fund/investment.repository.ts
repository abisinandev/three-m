import { injectable } from "inversify";
import { BaseRepository } from "../base.repository";
import { InvestmentEntity } from "@domain/entities/mutual-fund/investment.entity";
import { InvestmentDocument } from "@infrastructure/databases/mongo_db/models/interfaces/mutual-fund/investment.schema.interface";
import { IInvestmentRepository } from "@application/interfaces/repositories/investment-repository.interface";
import { InvestmentModel } from "@infrastructure/databases/mongo_db/models/schemas/investment.schema";
import { InvestmentMapper } from "@infrastructure/mappers/mutual-fund/investment.mapper";

@injectable()
export class InvestmentRepository extends BaseRepository<InvestmentEntity, InvestmentDocument> implements IInvestmentRepository{
    constructor() {
        super(InvestmentModel,InvestmentMapper);
    }
}