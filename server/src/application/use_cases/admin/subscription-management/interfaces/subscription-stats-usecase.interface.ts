import { SubscriptionStatsDTO } from "@application/dto/admin/subscription/subscription-data.dto";

export interface ISubscriptionStatsUseCase {
    execute(): Promise<SubscriptionStatsDTO>;
}