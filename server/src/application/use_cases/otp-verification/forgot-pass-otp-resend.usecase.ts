import type { ResendOtpDTO } from "@application/dto/auth/resend-otp.dto";
import type { ResendOtpResponseDTO } from "@application/dto/auth/resend-otp-response.dto";
import type { IEmailService } from "@application/interfaces/services/externals/email.service.interface";
import { ErrorMessage } from "@domain/enum/express/messages/error.message";
import { HttpStatus } from "@domain/enum/express/status-code";
import { AUTH_TYPES } from "@infrastructure/inversify_di/types/auth/auth.types";
import { USER_TYPES } from "@infrastructure/inversify_di/types/user/user.types";
import { redisClient } from "@infrastructure/providers/redis/redis.provider";
import { NotFoundError } from "@presentation/express/utils/error-handling";
import AppError from "@presentation/express/utils/error-handling/app.error";
import { generateOtp } from "@shared/utils/otp/otp-generator";
import { inject, injectable } from "inversify";
import type { IForgotPasswordResendOtpUseCase } from "../interfaces/user/forgot-pass-resend-otp-usecase.interface";
import { IUserRepository } from "@application/interfaces/repositories/user/user-repository.interface";

@injectable()
export class ForgotPasswordResendOtpUseCase
  implements IForgotPasswordResendOtpUseCase
{
  constructor(
    @inject(USER_TYPES.UserRepository)
    private readonly _userRepository: IUserRepository,
    @inject(AUTH_TYPES.IEmailService)
    private readonly _emailService: IEmailService,
  ) {}

  async execute(data: ResendOtpDTO): Promise<ResendOtpResponseDTO> {
    const { email } = data;

    const user = await this._userRepository.findByField("email", email);
    if (!user) throw new NotFoundError(ErrorMessage.USER_NOT_FOUND);

    const redisKey = `forgot-password-otp:${email}`;
    const otpData = await redisClient.hgetall(redisKey);

    const now = Date.now();
    let resendCount = 0;

    if (otpData?.otp) {
      if (otpData.lastResendAt && now - Number(otpData.lastResendAt) < 30000) {
        throw new AppError(
          ErrorMessage.RATE_LIMIT_MESSAGE,
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }

      if (otpData.resendCount && Number(otpData.resendCount) >= 5) {
        throw new AppError(
          ErrorMessage.MAX_RESEND_REACHED,
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }

      resendCount = Number(otpData.resendCount) + 1;
    }

    const otp = generateOtp();
    const expiresAt = now + 5 * 60 * 1000;

    await redisClient.hmset(redisKey, {
      email,
      otp,
      expiresAt,
      resendCount,
      lastResendAt: now,
    });

    await redisClient.expire(redisKey, 300);
    await this._emailService.sendOtpEmail(email, otp);
    return { expiresAt, resendCount };
  }
}
