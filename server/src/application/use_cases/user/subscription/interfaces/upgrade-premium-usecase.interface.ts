import { UpgradePremiumDTO } from "@application/dto/subscription/upgrade-premium.dto";

export interface IUpgradePremiumUseCase {
    execute(data:UpgradePremiumDTO): Promise<void>
}