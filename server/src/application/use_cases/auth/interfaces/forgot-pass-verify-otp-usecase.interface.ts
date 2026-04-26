import type { VerifyOtpDTO } from "@application/dto/auth/verify-otp.dto";

export interface IForgotPasswordVerifyOtpUseCase {
  execute(data: VerifyOtpDTO): Promise<{ resetToken: string }>;
}
