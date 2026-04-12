import { PaginatedPlansDTO } from "@application/dto/admin/subscription/subscription-management.dto";
import { QueryOptions } from "mongoose";

export interface ISubscriptionPlansUseCase {
    execute(options: QueryOptions): Promise<PaginatedPlansDTO>;
}