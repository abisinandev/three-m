import { SimulationRequestDTO, SimulationResultDTO } from "../../dto/expense-tracker/simulation-request.dto";

export interface ICalculateSimulationUseCase {
    execute(userId: string, request: SimulationRequestDTO): Promise<SimulationResultDTO>;
}
