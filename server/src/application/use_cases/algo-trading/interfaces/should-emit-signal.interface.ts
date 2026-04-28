import { SignalAction } from "@domain/entities/algo/enum/signal-enums";

export interface IShouldEmitSignalUseCase {
    execute(input: {
        userId: string;
        // algoId: string;
        symbol: string;
        action: SignalAction | null;
    }): Promise<boolean>;
}
