import { AdminAlgoTradingResponseDTO } from "@application/dto/admin/algo-trading/admin-algo-trading-response.dto";

export interface IAdminAlgoTradingUseCase{
    execute(): Promise<AdminAlgoTradingResponseDTO>;
}