import { PaginatedPlansDTO } from "@application/dto/admin/subscription/subscription-management.dto";
import { FilterQuery, QueryOptions } from "mongoose";

export interface ISubscriptionManagementUseCase {
    execute(filter: FilterQuery<unknown>, options: QueryOptions): Promise<PaginatedPlansDTO>;
}