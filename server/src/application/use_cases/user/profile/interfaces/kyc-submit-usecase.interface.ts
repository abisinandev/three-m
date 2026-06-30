import type { KycSubmitDTO } from "@application/dto/user/kyc-submit.dto";

export interface IKycSubmitUseCase {
  execute(userId: string, data: KycSubmitDTO): Promise<void>;
}
