import { MutualFundDTO } from "@application/dto/mutual-funds/mutual-fund.dto";

export interface IMutualFundsUseCase {
    execute(dto: MutualFundDTO): Promise<void>
}