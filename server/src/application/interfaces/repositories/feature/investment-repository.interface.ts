import { InvestmentEntity } from "@domain/entities/mutual-fund/investment.entity";
import { IBaseRepository } from "./base-repository.interface";

export interface IInvestmentRepository extends IBaseRepository<InvestmentEntity>{
    
}