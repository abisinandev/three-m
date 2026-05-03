import type { VerifyOtpDTO } from "@application/dto/auth/verify-otp.dto";

export interface ISignupVerifyOtpUseCase {
  execute(data: VerifyOtpDTO): Promise<void>;
}
