import { PlanEntity } from "@domain/entities/subscription/plan.entity";
import { IBaseRepository } from "../base-repository.interface";
import { FilterQuery, QueryOptions } from "mongoose";

export interface IPlanRepository extends IBaseRepository<PlanEntity> {
    findWithFilters(options: QueryOptions): Promise<PlanEntity[]>;
    count(filter?: FilterQuery<unknown>): Promise<{ totalCount: number }>;
    findPlans(): Promise<PlanEntity[] | null>;
}