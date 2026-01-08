import type { ResendOtpDTO } from "@application/dto/auth/resend-otp.dto";
import type { ResendOtpResponseDTO } from "@application/dto/auth/resend-otp-response.dto";
import type { IEmailService } from "@application/interfaces/services/externals/email.service.interface";
import { AUTH_TYPES } from "@infrastructure/inversify_di/types/auth/auth.types";
import { USER_TYPES } from "@infrastructure/inversify_di/types/user/user.types";
import { redisClient } from "@infrastructure/providers/redis/redis.provider";
import AppError from "@presentation/express/utils/error-handling/app.error";
import { generateOtp } from "@shared/utils/otp/otp-generator";
import { inject, injectable } from "inversify";
import type { ISignupResendOtpUseCase } from "../interfaces/user/singup-resend-otp-usecase.interface";
import { IUserRepository } from "@application/interfaces/repositories/user/user-repository.interface";

@injectable()
export class ResendOtpUseCase implements ISignupResendOtpUseCase {
  constructor(
    @inject(USER_TYPES.UserRepository)
    private readonly _userRepository: IUserRepository,
    @inject(AUTH_TYPES.IEmailService)
    private readonly _emailVerifyService: IEmailService,
  ) {}
  async execute(data: ResendOtpDTO): Promise<ResendOtpResponseDTO> {

    const user = await this._userRepository.findByField("email", data.email);

    const otp = generateOtp();
    const expiryTime = 5 * 60;
    const expiresAt = Date.now() + expiryTime * 1000;

    if (!user) throw new AppError("User not found", 404);
    if (user.isEmailVerified) throw new AppError("Email already verified", 400);

    const otpData = await redisClient.hgetall(`otp:${user.email}`);

    if (otpData) {
      const now = Date.now();

      if (otpData.lastResendAt && now - Number(otpData.lastResendAt) < 30000) {
        throw new AppError("Please wait before requesting another OTP", 429);
      }

      if (Number(otpData.resendCount) >= 5) {
        throw new AppError("Maximum resend attempts reached", 429);
      }
    }

    await this._emailVerifyService.sendOtpEmail(data.email, otp);
    return { expiresAt, resendCount: 0 };
  }
}
