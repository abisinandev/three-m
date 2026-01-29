import { VerifyOtpDTO } from "@application/dto/auth/verify-otp.dto";

export interface IChangeEmailVerifyOtpUseCase {
    execute(userId: string, data: VerifyOtpDTO): Promise<void>
}