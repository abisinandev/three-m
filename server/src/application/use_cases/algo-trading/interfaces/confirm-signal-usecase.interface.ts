import { ConfirmSignalDTO } from "@application/dto/algo-trading/confirm-signal.dto";

export interface IConfirmSignalUseCase {
    execute(data: ConfirmSignalDTO): Promise<void>;
}
