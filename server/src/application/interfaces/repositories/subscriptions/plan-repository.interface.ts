import { PlanEntity } from "@domain/entities/subscription/plan.entity";
import { IBaseRepository } from "../base-repository.interface";

export interface IPlanRepository extends IBaseRepository<PlanEntity>{
    
}