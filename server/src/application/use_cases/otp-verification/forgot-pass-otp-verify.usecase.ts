import crypto from "node:crypto";
import type { VerifyOtpDTO } from "@application/dto/auth/verify-otp.dto";
import { ErrorMessage } from "@domain/enum/express/messages/error.message";
import { USER_TYPES } from "@infrastructure/inversify_di/types/user/user.types";
import { redisClient } from "@infrastructure/providers/redis/redis.provider";
import {
  NotFoundError,
  ValidationError,
} from "@presentation/express/utils/error-handling";
import { inject, injectable } from "inversify";
import type { IForgotPasswordVerifyOtpUseCase } from "../interfaces/user/forgot-pass-verify-otp-usecase.interface";
import { IUserRepository } from "@application/interfaces/repositories/user/user-repository.interface";

@injectable()
export class ForgotPasswordOtpVerifyUseCase implements IForgotPasswordVerifyOtpUseCase {
  constructor(
    @inject(USER_TYPES.UserRepository) private readonly _userRepository: IUserRepository,
  ) { }

  async execute(data: VerifyOtpDTO): Promise<{ resetToken: string }> {
    const redisKey = `forgot-password-otp:${data.email}`;
    const storedOtp = await redisClient.hgetall(redisKey);

    if (!storedOtp || !storedOtp.otp) {
      throw new ValidationError(ErrorMessage.OTP_EXPIRED);
    }

    if (Number(storedOtp.expiresAt) < Date.now()) {
      throw new ValidationError(ErrorMessage.OTP_EXPIRED);
    }

    if (storedOtp.otp !== data.otp) {
      throw new ValidationError(ErrorMessage.INVALID_OTP);
    }

    const user = await this._userRepository.findByField("email", data.email);
    if (!user) {
      throw new NotFoundError(ErrorMessage.USER_NOT_FOUND);
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    await redisClient.setex(`reset-token:${resetToken}`, 300, hashedResetToken);
    await redisClient.del(redisKey);

    return { resetToken };
  }
}
