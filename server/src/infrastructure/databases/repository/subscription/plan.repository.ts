import { PlanEntity } from "@domain/entities/subscription/plan.entity";
import { BaseRepository } from "../base.repository";
import { PlanDocument, PlanModel } from "@infrastructure/databases/mongo_db/models/schemas/subscriptions/plans-schema";
import { IPlanRepository } from "@application/interfaces/repositories/subscriptions/plan-repository.interface";
import { PlanMapper } from "@infrastructure/mappers/subscription/plan.mapper";

export class PlanRepository extends BaseRepository<PlanEntity, PlanDocument>
    implements IPlanRepository {

    constructor() {
        super(PlanModel, PlanMapper)
    }

}