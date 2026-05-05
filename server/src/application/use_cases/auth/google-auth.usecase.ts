import type { GoogleResponseDTO } from "@application/dto/auth/google-auth-reseponse.dto";
import type { IGoogleAuthService } from "@application/interfaces/services/externals/google-auth.service.interface";
import type { IJwtProvider } from "@application/interfaces/services/externals/jwt.provider.interface";
import { UserEntity } from "@domain/entities/user/user.entity";
import { ErrorMessages } from "@shared/constants/error.messages";
import { AuthProvider } from "@domain/enum/users/auth-provider.enum";
import type { JwtPayload } from "@domain/types/jwt-payload.type";
import { AUTH_TYPES } from "@infrastructure/inversify_di/features/auth/auth.types";
import { USER_TYPES } from "@infrastructure/inversify_di/features/user/user.types";
import { redisClient } from "@infrastructure/providers/redis/redis.provider";
import { env } from "@presentation/express/utils/constants/env.constants";
import {
  UnauthorizedError,
  ValidationError,
} from "@presentation/express/utils/error-handling";
import { inject, injectable } from "inversify";
import type { IGoogleAuthUseCase } from "./interfaces/google-auth.usecase.interface";
import { IUserRepository } from "@application/interfaces/repositories/user/user-repository.interface";

@injectable()
export class GoogleAuthUseCase implements IGoogleAuthUseCase {
  constructor(
    @inject(AUTH_TYPES.GoogleAuthService) private readonly _googleAuthServie: IGoogleAuthService,
    @inject(USER_TYPES.UserRepository) private readonly _userRepository: IUserRepository,
    @inject(AUTH_TYPES.IJwtProvider) private readonly _jwtProvider: IJwtProvider,
  ) { }

  async execute(data: { provider: "google", token: string; }): Promise<GoogleResponseDTO> {

    const { email, emailVerified, id, name, avatar } =
      await this._googleAuthServie.verifyToken(data.token);

    if (!emailVerified) {
      throw new UnauthorizedError(ErrorMessages.AUTH.EMAIL_NOT_VERIFIED);
    }

    let user = await this._userRepository.findByField("email", email);

    if (!user) {
      const user = UserEntity.createSocialUser({
        email,
        fullName: name,
        avatar,
        provider: AuthProvider.GOOGLE,
        googleId: id,
      });
      await this._userRepository.create(user);
    }

    user = await this._userRepository.findByField("email", email);
    if (!user) throw new ValidationError(ErrorMessages.AUTH.USER_NOT_FOUND);

    const payload: JwtPayload = {
      id: user.id as string,
      userCode: user.userCode as string,
      role: user.role,
      email: user.email,
    };

    const accessToken = this._jwtProvider.generateAccessToken(payload);
    const refreshToken = this._jwtProvider.generateRefreshToken(payload);

    const key = `refresh_token:${user.id}`;
    const ttl = Number(env.REFRESH_EXPIRES_IN);
    await redisClient.hset(key, "refreshToken", refreshToken);
    await redisClient.expire(key, ttl);

    return { accessToken, refreshToken, user };
  }
}
