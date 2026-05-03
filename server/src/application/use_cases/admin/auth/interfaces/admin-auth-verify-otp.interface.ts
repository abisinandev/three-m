import type { VerifyOtpDTO } from "@application/dto/auth/verify-otp.dto";
import type { VerifyOtpResponseDTO } from "@application/dto/auth/verify-otp-response.dto";

export interface IAdminAuthVerifyOtpUseCase {
  execute(data: VerifyOtpDTO): Promise<VerifyOtpResponseDTO>;
}
