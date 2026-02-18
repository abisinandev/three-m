import { injectable } from "inversify";
import { ICalculateProjectionUseCase } from "./interfaces/calculate-projection-usecase.interface";

@injectable()
export class CalculateProjectionUseCase implements ICalculateProjectionUseCase {

    async execute(): Promise<void> {
        
    }
}