import { injectable } from "inversify";
import { BaseRepository } from "../base.repository";
import { InvestmentEntity } from "@domain/entities/investment.entity";
import { InvestmentDocument } from "@infrastructure/databases/mongo_db/models/interfaces/investment.schema.interface";
import { IInvestmentRepository } from "@application/interfaces/repositories/investment-repository.interface";
import { InvestmentModel } from "@infrastructure/databases/mongo_db/models/schemas/investment.schema";
import { InvestmentMapper } from "@infrastructure/mappers/investment.mapper";

@injectable()
export class InvestmentRepository extends BaseRepository<InvestmentEntity, InvestmentDocument> implements IInvestmentRepository{
    constructor() {
        super(InvestmentModel,InvestmentMapper);
    }
}