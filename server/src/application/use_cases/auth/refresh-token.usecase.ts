import type { RefreshDTO } from "@application/dto/auth/refresh.dto";
import type { RefreshResponseDTO } from "@application/dto/auth/refresh-response.dto";
import type { IJwtProvider } from "@application/interfaces/services/externals/jwt.provider.interface";
import { ErrorMessages } from "@shared/constants/error.messages";
import type { JwtPayload } from "@domain/types/jwt-payload.type";
import { AUTH_TYPES } from "@infrastructure/inversify_di/features/auth/auth.types";
import { USER_TYPES } from "@infrastructure/inversify_di/features/user/user.types";
import { redisClient } from "@infrastructure/providers/redis/redis.provider";
import {
  NotFoundError,
  ValidationError,
} from "@presentation/express/utils/error-handling";
import { inject, injectable } from "inversify";
import type { IRefreshTokenUseCase } from "./interfaces/refresh-token-usecase.interface";
import { IUserRepository } from "@application/interfaces/repositories/user/user-repository.interface";

@injectable()
export class RefreshTokenUseCase implements IRefreshTokenUseCase {
  constructor(
    @inject(AUTH_TYPES.IJwtProvider) private readonly _jwtProvider: IJwtProvider,
    @inject(USER_TYPES.UserRepository) private readonly _userRepository: IUserRepository,
  ) { }
  async execute(data: RefreshDTO): Promise<RefreshResponseDTO> {
    if (!data.refreshToken)
      throw new ValidationError(ErrorMessages.AUTH.REFRESH_TOKEN_MISSING);
    const decoded = this._jwtProvider.verifyJwtTokens(
      data.refreshToken,
      "refresh",
    );

    if (typeof decoded === "string" || !decoded.id) {
      throw new ValidationError(ErrorMessages.AUTH.REFRESH_TOKEN_EXPIRED);
    }

    const storedToken = await redisClient.hgetall(
      `refresh_token:${decoded.id}`,
    );

    if (!storedToken || storedToken.refreshToken !== data.refreshToken) {
      throw new ValidationError(ErrorMessages.AUTH.REFRESH_TOKEN_NOT_FOUND);
    }

    const user = await this._userRepository.findById(decoded.id);

    if (!user) throw new NotFoundError(ErrorMessages.AUTH.USER_NOT_FOUND);

    const payload: JwtPayload = {
      id: user.id as string,
      userCode: user.userCode,
      role: user.role,
      email: user.email,
      isBlocked: user.isBlocked,
    };
    const newAccessToken = this._jwtProvider.generateAccessToken(payload);
    return { accessToken: newAccessToken };
  }
}
