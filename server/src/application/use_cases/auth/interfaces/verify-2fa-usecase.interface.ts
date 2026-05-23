import type { Verify2faDTO } from "@application/dto/auth/2fa-verify-dto";
import type { VerifyOtpResponseDTO } from "@application/dto/auth/verify-otp-response.dto";

export interface IVerifyTwoFactorUseCase {
  execute(data: Verify2faDTO): Promise<VerifyOtpResponseDTO>;
}
