import type { VerifyOtpDTO } from "@application/dto/auth/verify-otp.dto";
import { toEntity } from "@application/mappers/user/user.mapper";
import { ErrorMessages } from "@shared/constants/error.messages";
import { USER_TYPES } from "@infrastructure/inversify_di/features/user/user.types";
import { redisClient } from "@infrastructure/providers/redis/redis.provider";
import {
  NotFoundError,
  ValidationError,
} from "@presentation/express/utils/error-handling";
import { inject, injectable } from "inversify";
import type { ISignupVerifyOtpUseCase } from "../auth/interfaces/signup-verify-otp-usecase.interface";
import { IUserRepository } from "@application/interfaces/repositories/user/user-repository.interface";

@injectable()
export class SignupVerifyOtpUseCase implements ISignupVerifyOtpUseCase {
  constructor(
    @inject(USER_TYPES.UserRepository) private readonly _userRepository: IUserRepository,
  ) { }

  async execute(data: VerifyOtpDTO): Promise<void> {
    const storedData = await redisClient.hgetall(`otp:${data.email}`);

    if (!storedData || !storedData?.otp) {
      throw new ValidationError(ErrorMessages.AUTH.OTP_EXPIRED);
    }

    const expiresAt = Number(storedData.expiresAt);

    if (Date.now() > expiresAt) {
      throw new ValidationError(ErrorMessages.AUTH.OTP_EXPIRED);
    }

    if (storedData.otp !== data.otp)
      throw new ValidationError(ErrorMessages.AUTH.INVALID_OTP);


    if (storedData.userData) {
      const userData = JSON.parse(storedData.userData);
      const newUser = toEntity(userData, userData.password);
      await this._userRepository.create(newUser);
    }

    await redisClient.del(`otp:${data.email}`);
  }
}
