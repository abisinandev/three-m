import { ConfirmSignalDTO } from "@application/dto/algo-trading/confirm-signal.dto";

export interface IConfirmSellSignalUseCase {
    execute(data: ConfirmSignalDTO): Promise<void | { message: string, upgrade: boolean }>;
}
