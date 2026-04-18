import { ConfirmSignalDTO } from "@application/dto/algo-trading/confirm-signal.dto";

export interface IConfirmBuySignalUseCase {
    execute(data: ConfirmSignalDTO): Promise<void>
}

export interface IConfirmSellSignalUseCase {
    execute(data: ConfirmSignalDTO): Promise<void>
}