import { AnalyticsResponseDTO } from "@application/dto/expense-tracker/analytics-response.dto";

export interface IAnalyticsUseCase {
    execute(userId: string, month?: string): Promise<AnalyticsResponseDTO>;
}
