import type { Verify2faDTO } from "@application/dto/auth/2fa-verify-dto";
import type { VerifyOtpResponseDTO } from "@application/dto/auth/verify-otp-response.dto";
import type { ITwoFactorAuthVerify } from "@application/interfaces/services/externals/2fa-auth-verify.interface";
import type { IJwtProvider } from "@application/interfaces/services/externals/jwt.provider.interface";
import { ErrorMessages } from "@shared/constants/error.messages";
import type { JwtPayload } from "@domain/types/jwt-payload.type";
import { AUTH_TYPES } from "@infrastructure/inversify_di/features/auth/auth.types";
import { USER_TYPES } from "@infrastructure/inversify_di/features/user/user.types";
import { redisClient } from "@infrastructure/providers/redis/redis.provider";
import { env } from "@presentation/express/utils/constants/env.constants";
import {
  ForbiddenError,
  UnauthorizedError,
} from "@presentation/express/utils/error-handling";
import { inject, injectable } from "inversify";
import type { IVerifyTwoFactorUseCase } from "./interfaces/verify-2fa-usecase.interface";
import { IUserRepository } from "@application/interfaces/repositories/user/user-repository.interface";

@injectable()
export class VerifyTwoFactorUseCase implements IVerifyTwoFactorUseCase {
  constructor(
    @inject(USER_TYPES.UserRepository) private readonly _userRepository: IUserRepository,
    @inject(AUTH_TYPES.IJwtProvider) private readonly _jwtProvider: IJwtProvider,
    @inject(AUTH_TYPES.TwoFactorAuthVerify) private readonly _twoFactorAuthVerify: ITwoFactorAuthVerify,
  ) { }

  async execute(data: Verify2faDTO): Promise<VerifyOtpResponseDTO> {
    const user = await this._userRepository.findByField("email", data.email);
    if (!user?.twoFactorSecret) throw new ForbiddenError(ErrorMessages.AUTH.TWO_FA_NOT_CONFIGURED);

    const isValid = await this._twoFactorAuthVerify.verify(
      user.twoFactorSecret,
      data.token,
    );

    if (!isValid) throw new UnauthorizedError(ErrorMessages.AUTH.INVALID_OTP);

    const payload: JwtPayload = {
      id: user.id as string,
      userCode: user.userCode,
      role: user.role,
      email: user.email,
      isBlocked: user.isBlocked,
    };

    const accessToken = this._jwtProvider.generateAccessToken(payload);
    const refreshToken = this._jwtProvider.generateRefreshToken(payload);

    const key = `refresh_token:${user.id}`;
    const ttl = Number(env.REFRESH_EXPIRES_IN);
    await redisClient.hset(key, "refreshToken", refreshToken);
    await redisClient.expire(key, ttl);

    return { accessToken, refreshToken };
  }
}
