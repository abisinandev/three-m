import type { RefreshDTO } from "@application/dto/auth/refresh.dto";
import type { RefreshResponseDTO } from "@application/dto/auth/refresh-response.dto";
import type { IJwtProvider } from "@application/interfaces/services/externals/jwt.provider.interface";
import type { IRefreshTokenUseCase } from "@application/use_cases/interfaces/admin/admin-refresh-token.interface";
import { ErrorMessage } from "@domain/enum/express/messages/error.message";
import type { JwtPayload } from "@domain/types/jwt-payload.type";
import { ADMIN_TYPES } from "@infrastructure/inversify_di/types/admin/admin.types";
import { AUTH_TYPES } from "@infrastructure/inversify_di/types/auth/auth.types";
import { redisClient } from "@infrastructure/providers/redis/redis.provider";
import {
  NotFoundError,
  ValidationError,
} from "@presentation/express/utils/error-handling";
import { inject, injectable } from "inversify";
import { IAdminRepository } from "@application/interfaces/repositories/admin/admin.repository.interface";

@injectable()
export class AdminRefreshTokenUseCase implements IRefreshTokenUseCase {
  constructor(
    @inject(AUTH_TYPES.IJwtProvider) private readonly _jwtProvider: IJwtProvider,
    @inject(ADMIN_TYPES.AdminRepository) private readonly _adminRepository: IAdminRepository,
  ) { }

  async execute(data: RefreshDTO): Promise<RefreshResponseDTO> {
    if (!data.refreshToken)
      throw new ValidationError("Refresh token is missing");
    const decoded = await this._jwtProvider.verifyJwtTokens(
      data.refreshToken,
      "refresh",
    );

    if (typeof decoded === "string" || !decoded.id) {
      throw new ValidationError(ErrorMessage.REFRESH_TOKEN_EXPIRED);
    }

    const storedToken = await redisClient.hgetall(
      `refresh_token:${decoded.id}`,
    );

    if (!storedToken || storedToken.refreshToken !== data.refreshToken) {
      throw new ValidationError(ErrorMessage.REFRESH_TOKEN_NOT_FOUND);
    }

    const isAdmin = await this._adminRepository.findOne({
      email: decoded.email,
    });
    if (!isAdmin) throw new NotFoundError(ErrorMessage.ADMIN_NOT_FOUND);

    const payload: JwtPayload = {
      id: isAdmin.id as string,
      userCode: isAdmin.adminCode,
      role: isAdmin.role,
      email: isAdmin.email,
    };

    const newAccessToken = this._jwtProvider.generateAccessToken(payload);
    return { accessToken: newAccessToken };
  }
}
