import type { ResendOtpDTO } from "@application/dto/auth/resend-otp.dto";
import { ErrorMessages } from "@shared/constants/error.messages";
import type { ResendOtpResponseDTO } from "@application/dto/auth/resend-otp-response.dto";
import type { IEmailService } from "@application/interfaces/services/externals/email.service.interface";
import { AUTH_TYPES } from "@infrastructure/inversify_di/features/auth/auth.types";
import { redisClient } from "@infrastructure/providers/redis/redis.provider";
import AppError from "@presentation/express/utils/error-handling/app.error";
import { generateOtp } from "@shared/utils/otp/otp-generator";
import { inject, injectable } from "inversify";
import type { ISignupResendOtpUseCase } from "../auth/interfaces/singup-resend-otp-usecase.interface";
import { HttpStatus } from "@domain/enum/express/status-code";
import { env } from "@presentation/express/utils/constants/env.constants";

@injectable()
export class ResendOtpUseCase implements ISignupResendOtpUseCase {
  constructor(
    @inject(AUTH_TYPES.IEmailService) private readonly _emailVerifyService: IEmailService,
  ) { }
  async execute(data: ResendOtpDTO): Promise<ResendOtpResponseDTO> {

    const otpData = await redisClient.hgetall(`otp:${data.email}`);

    if (!otpData || !otpData.email) {
      throw new AppError(ErrorMessages.AUTH.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    let resendCount = 0;
    const now = Date.now();

    if (otpData?.otp) {
      if (otpData.lastResendAt && now - Number(otpData.lastResendAt) < 30000) {
        throw new AppError(ErrorMessages.AUTH.RATE_LIMIT_MESSAGE, HttpStatus.CONFLICT);
      }

      if (otpData.resendCount && Number(otpData.resendCount) >= 5) {
        throw new AppError(ErrorMessages.AUTH.MAX_RESEND_REACHED, HttpStatus.CONFLICT);
      }

      resendCount = Number(otpData.resendCount) + 1;
    }

    const otp = generateOtp();
    const expiryTime = 5 * 60;
    const expiresAt = now + expiryTime * 1000;
    const ttl = env.TTL;

    await redisClient.hmset(`otp:${data.email}`, {
      ...otpData,
      email: data.email,
      otp,
      expiresAt,
      resendCount,
      lastResendAt: now,
    });

    await redisClient.expire(`otp:${data.email}`, ttl);
    await this._emailVerifyService.sendOtpEmail(data.email, otp);

    return { expiresAt, resendCount };
  }
}
