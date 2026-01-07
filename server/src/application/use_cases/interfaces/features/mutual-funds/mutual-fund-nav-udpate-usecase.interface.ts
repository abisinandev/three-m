import { MutualFundNavDTO } from "@application/dto/mutual-funds/mutual-fund-nav-dto";

export interface IMutualFundNavUpdatesUseCase {
    execute(): Promise<void>;
}