import type { VerifyOtpDTO } from "@application/dto/auth/verify-otp.dto";
import type { VerifyOtpResponseDTO } from "@application/dto/auth/verify-otp-response.dto";
import type { IJwtProvider } from "@application/interfaces/services/externals/jwt.provider.interface";
import type { IAdminAuthVerifyOtpUseCase } from "@application/use_cases/admin/interfaces/admin-auth-verify-otp.interface";
import { ErrorMessage } from "@domain/enum/express/messages/error.message";
import type { JwtPayload } from "@domain/types/jwt-payload.type";
import { ADMIN_TYPES } from "@infrastructure/inversify_di/features/admin/admin.types";
import { AUTH_TYPES } from "@infrastructure/inversify_di/features/auth/auth.types";
import { redisClient } from "@infrastructure/providers/redis/redis.provider";
import { env } from "@presentation/express/utils/constants/env.constants";
import {
  NotFoundError,
  ValidationError,
} from "@presentation/express/utils/error-handling";
import { inject, injectable } from "inversify";
import { IAdminRepository } from "@application/interfaces/repositories/admin/admin.repository.interface";

@injectable()
export class AdminAuthVerifyOtpUseCase implements IAdminAuthVerifyOtpUseCase {
  constructor(
    @inject(ADMIN_TYPES.AdminRepository) private readonly _adminRepository: IAdminRepository,
    @inject(AUTH_TYPES.IJwtProvider) private readonly _jwtProvider: IJwtProvider,
  ) { }

  async execute(data: VerifyOtpDTO): Promise<VerifyOtpResponseDTO> {
    const storedOtp = await redisClient.hgetall(`otp:${data.email}`);
    if (!storedOtp || !storedOtp.otp)
      throw new ValidationError(ErrorMessage.OTP_EXPIRED);

    if (Number(storedOtp.expiresAt) < Date.now())
      throw new ValidationError(ErrorMessage.OTP_EXPIRED);

    if (storedOtp.otp !== data.otp)
      throw new ValidationError(ErrorMessage.INVALID_OTP);

    await redisClient.del(`otp:${data.email}`);
    const isExist = await this._adminRepository.findOne({ email: data.email });
    if (!isExist) throw new NotFoundError(ErrorMessage.ADMIN_NOT_FOUND);

    const payload: JwtPayload = {
      id: isExist.id as string,
      adminCode: isExist.adminCode,
      role: isExist.role,
      email: isExist.email,
    };

    const accessToken = this._jwtProvider.generateAccessToken(payload);
    const refreshToken = this._jwtProvider.generateRefreshToken(payload);

    const key = `refresh_token:${isExist.id}`;
    const ttl = Number(env.REFRESH_EXPIRES_IN);
    await redisClient.hset(key, "refreshToken", refreshToken);
    await redisClient.expire(key, ttl);

    return { accessToken, refreshToken };
  }
}
