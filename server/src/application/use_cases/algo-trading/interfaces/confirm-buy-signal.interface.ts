import { ConfirmSignalDTO } from "@application/dto/algo-trading/confirm-signal.dto";

export interface IConfirmBuySignalUseCase {
    execute(order: ConfirmSignalDTO): Promise<undefined | { message: string, upgrade: boolean }>;
}
