import type { CreateUserDTO } from "@application/dto/auth/create-user.dto";
import type { SignupResponseDTO } from "@application/dto/auth/signup-response.dto";
import type { IEmailService } from "@application/interfaces/services/externals/email.service.interface";
import type { IPasswordHashingService } from "@application/interfaces/services/externals/password-hashing.service.interface";
import { toEntity } from "@application/mappers/user/user.mapper";
import { ErrorMessages } from "@shared/constants/error.messages";
import { AUTH_TYPES } from "@infrastructure/inversify_di/features/auth/auth.types";
import { USER_TYPES } from "@infrastructure/inversify_di/features/user/user.types";
import { redisClient } from "@infrastructure/providers/redis/redis.provider";
import { ConflictError } from "@presentation/express/utils/error-handling/index";
import { generateOtp } from "@shared/utils/otp/otp-generator";
import { inject, injectable } from "inversify";
import type { IUserSignupUseCase } from "../user/interfaces/user-signup.usecase.interface";
import { IUserRepository } from "@application/interfaces/repositories/user/user-repository.interface";

@injectable()
export class UserSignupUseCase implements IUserSignupUseCase {
  constructor(
    @inject(USER_TYPES.UserRepository) private readonly _userRepository: IUserRepository,
    @inject(AUTH_TYPES.IPasswordHashingService) private readonly _passswordHashing: IPasswordHashingService,
    @inject(AUTH_TYPES.IEmailService) private readonly _emailVerifyService: IEmailService,
  ) { }

  async execute(user: CreateUserDTO): Promise<SignupResponseDTO> {
    const isExistingUser = await this._userRepository.findByField(
      "email",
      user.email,
    );
    const otp = generateOtp();
    const expiryTime = 5 * 60;
    const expiresAt = Date.now() + expiryTime * 1000;
    const redisKey = `otp:${user.email}`;
    const resendCount = 0;
    const now = Date.now();

    if (isExistingUser) {
      if (isExistingUser.isEmailVerified) {
        throw new ConflictError(ErrorMessages.VALIDATION.EMAIL_ALREADY_EXISTS);
      }

      await this._emailVerifyService.sendOtpEmail(user.email, otp);
      await redisClient.hmset(redisKey, {
        email: user.email,
        otp,
        expiresAt,
        resendCount,
        lastResendAt: now,
      });
      await redisClient.expire(redisKey, 300);

      return { expiresAt, isAlreadyCreated: true };
    }

    const isExistingPhone = await this._userRepository.findByField(
      "phone",
      user.phone,
    );
    if (isExistingPhone) {
      throw new ConflictError(ErrorMessages.VALIDATION.PHONE_ALREADY_EXISTS);
    }

    const hashedPassword = await this._passswordHashing.hash(user.password);
    const newUser = toEntity(user, hashedPassword);
    await this._userRepository.create(newUser);

    await this._emailVerifyService.sendOtpEmail(user.email, otp);
    await redisClient.hmset(redisKey, {
      email: user.email,
      otp,
      expiresAt,
      resendCount,
      lastResendAt: now,
    });
    await redisClient.expire(redisKey, 300);
    return { expiresAt, isAlreadyCreated: false };
  }
}
