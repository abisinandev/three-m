import { inject, injectable } from "inversify";
import { SignalAction } from "@domain/entities/algo/enum/signal-enums";
import { IShouldEmitSignalUseCase } from "./interfaces/should-emit-signal.interface";
import { STOCK_TYPES } from "@infrastructure/inversify_di/features/stock/stock.types";
import { IAlgoSignalRepository } from "@application/interfaces/repositories/algo/algo-signal-repository.interface";

@injectable()
export class ShouldEmitSignalUseCase implements IShouldEmitSignalUseCase {
    constructor(
        @inject(STOCK_TYPES.AlgoSignalRepository) private readonly _signalRepository: IAlgoSignalRepository
    ) { }

    async execute(input: {
        userId: string;
        // algoId: string;
        symbol: string;
        action: SignalAction | null;
    }): Promise<boolean> {
        const { userId,
            // algoId,
            symbol,
            action
        } = input;

        if (action === null) {
            return false; 
        }

        const lastAction = await this._signalRepository.getLastSignalAction(
            userId,
            // algoId,
            symbol
        );

        if (!lastAction || lastAction !== action) {
            return true;
        }

        return false;
    }
}
