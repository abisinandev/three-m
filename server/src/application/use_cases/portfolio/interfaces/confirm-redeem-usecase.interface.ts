import { ConfirmRedeemDTO } from "@application/dto/portfolio/confirm-radeem-dto";

export interface IConfirmRedeemUseCase {
    execute(data: ConfirmRedeemDTO): Promise<void>
}