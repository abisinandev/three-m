import { PendingOrderResponseDTO } from "@application/dto/stock/pending-order.dto";

export interface IFetchPendingOrdersUseCase {
    execute(userId: string, symbol?: string): Promise<PendingOrderResponseDTO[]>;
}
