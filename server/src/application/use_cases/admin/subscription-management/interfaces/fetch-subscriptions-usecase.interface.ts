import { PaginatedSubscriptionsDTO } from "@application/dto/admin/subscription/subscription-data.dto";
import { QueryOptions } from "mongoose";

export interface IFetchSubscriptionsUseCase {
    execute(options: QueryOptions): Promise<PaginatedSubscriptionsDTO>;
}