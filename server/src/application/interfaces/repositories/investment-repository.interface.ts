import { InvestmentEntity } from "@domain/entities/investment.entity";
import { IBaseRepository } from "./base-repository.interface";

export interface IInvestmentRepository extends IBaseRepository<InvestmentEntity>{
    
}