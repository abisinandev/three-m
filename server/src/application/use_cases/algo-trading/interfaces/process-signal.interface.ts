import { SignalAction } from "@domain/entities/algo/enum/signal-enums";

export interface ProcessSignalDTO {
    userId: string;
    symbol: string;
    algoId: string;
    action: SignalAction;
    strategyName: string;
    price: number;
    reason: string;
}

export interface IProcessSignalUseCase {
    execute(input: ProcessSignalDTO): Promise<void>;
}
