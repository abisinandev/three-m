import type { ResendOtpDTO } from "@application/dto/auth/resend-otp.dto";
import type { ResendOtpResponseDTO } from "@application/dto/auth/resend-otp-response.dto";

export interface IForgotPasswordResendOtpUseCase {
  execute(data: ResendOtpDTO): Promise<ResendOtpResponseDTO>;
}
