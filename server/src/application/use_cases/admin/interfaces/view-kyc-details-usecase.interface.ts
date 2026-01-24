import type { KycResponseDTO } from "@application/dto/user/kyc-response.dto";

export interface IViewKycDetailsUseCase {
  execute(kycId: string): Promise<KycResponseDTO>;
}
