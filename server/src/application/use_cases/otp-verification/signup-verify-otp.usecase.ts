import type { VerifyOtpDTO } from "@application/dto/auth/verify-otp.dto";
import { ErrorMessage } from "@domain/enum/express/messages/error.message";
import { USER_TYPES } from "@infrastructure/inversify_di/features/user/user.types";
import { redisClient } from "@infrastructure/providers/redis/redis.provider";
import {
  NotFoundError,
  ValidationError,
} from "@presentation/express/utils/error-handling";
import { inject, injectable } from "inversify";
import type { ISignupVerifyOtpUseCase } from "../user/interfaces/signup-verify-otp-usecase.interface";
import { IUserRepository } from "@application/interfaces/repositories/user/user-repository.interface";

@injectable()
export class SignupVerifyOtpUseCase implements ISignupVerifyOtpUseCase {
  constructor(
    @inject(USER_TYPES.UserRepository)
    private readonly _userRepository: IUserRepository,
  ) {}

  async execute(data: VerifyOtpDTO): Promise<void> {
    const storedOtp = await redisClient.hgetall(`otp:${data.email}`);

    if (!storedOtp || !storedOtp.otp)
      throw new ValidationError(ErrorMessage.OTP_EXPIRED);

    if (Number(storedOtp.expiresAt) < Date.now())
      throw new ValidationError(ErrorMessage.OTP_EXPIRED);

    if (storedOtp.otp !== data.otp)
      throw new ValidationError(ErrorMessage.INVALID_OTP);

    const user = await this._userRepository.verifyEmail(data.email);
    if (!user) throw new NotFoundError(ErrorMessage.USER_NOT_FOUND);

    await redisClient.del(data.email);
  }
}
