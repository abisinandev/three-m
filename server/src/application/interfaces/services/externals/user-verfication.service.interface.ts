import type { OtpDTO } from "@application/dto/auth/send-otp.dto";

export interface IVerificationService {
  verify(email: string): Promise<OtpDTO>;
}
