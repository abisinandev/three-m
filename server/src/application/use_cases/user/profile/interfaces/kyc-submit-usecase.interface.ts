import type { KycSubmitDTO } from "@application/dto/user/kyc-submit.dto";

export interface IKycSubmitUseCase {
  execute(data: KycSubmitDTO): Promise<void>;
}
