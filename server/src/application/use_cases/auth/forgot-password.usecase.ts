import type { ForgotPasswordDTO } from "@application/dto/auth/forgot-password";
import type { IUserRepository } from "@application/interfaces/repositories/user-repository.interface";
import type { IEmailService } from "@application/interfaces/services/externals/email.service.interface";
import { AUTH_TYPES } from "@infrastructure/inversify_di/types/auth/auth.types";
import { USER_TYPES } from "@infrastructure/inversify_di/types/user/user.types";
import { redisClient } from "@infrastructure/providers/redis/redis.provider";
import { NotFoundError } from "@presentation/express/utils/error-handling";
import { generateOtp } from "@shared/utils/otp/otp-generator";
import { inject, injectable } from "inversify";
import type { IForgotPasswordUseCase } from "../interfaces/user/forgot-password-usecase.interface";

@injectable()
export class ForgotPasswordUseCase implements IForgotPasswordUseCase {
  constructor(
    @inject(USER_TYPES.UserRepository) private readonly _userRepository: IUserRepository,
    @inject(AUTH_TYPES.IEmailService) private readonly _emailService: IEmailService,
  ) { }

  async execute(data: ForgotPasswordDTO): Promise<void> {
    const user = await this._userRepository.findByField("email", data.email);
    if (!user) throw new NotFoundError("User doest not exist");

    const redisKey = `forgot-password-otp:${data.email}`;
    const otp = generateOtp();
    const expiryTime = 5 * 60;
    const expiresAt = Date.now() + expiryTime * 1000;
    const now = Date.now();
    const resendCount = 0;

    await redisClient.hmset(redisKey, {
      email: data.email,
      otp,
      expiresAt,
      resendCount,
      lastResendAt: now,
    });
    await redisClient.expire(redisKey, 300);
    await this._emailService.sendOtpEmail(data.email, otp);
  }
}
