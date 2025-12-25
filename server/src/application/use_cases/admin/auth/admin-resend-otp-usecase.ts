import type { ResendOtpDTO } from "@application/dto/auth/resend-otp.dto";
import type { ResendOtpResponseDTO } from "@application/dto/auth/resend-otp-response.dto";
import type { IAdminRepository } from "@application/interfaces/repositories/admin.repository.interface";
import type { IEmailService } from "@application/interfaces/services/externals/email.service.interface";
// import type { IJwtProvider } from "@application/interfaces/services/externals/jwt.provider.interface";
import type { IAdminResendOtpUseCase } from "@application/use_cases/interfaces/admin/admin-resend-otp-usecase-interface";
import { ErrorMessage } from "@domain/enum/express/messages/error.message";
// import type { JwtPayload } from "@domain/types/jwt-payload.type";
import { ADMIN_TYPES } from "@infrastructure/inversify_di/types/admin/admin.types";
import { AUTH_TYPES } from "@infrastructure/inversify_di/types/auth/auth.types";
import { redisClient } from "@infrastructure/providers/redis/redis.provider";
// import { env } from "@presentation/express/utils/constants/env.constants";
import { NotFoundError } from "@presentation/express/utils/error-handling";
import AppError from "@presentation/express/utils/error-handling/app.error";
import { generateOtp } from "@shared/utils/otp/otp-generator";
import { inject, injectable } from "inversify";

@injectable()
export class AdminResendOtpUseCase implements IAdminResendOtpUseCase {
  constructor(
    @inject(ADMIN_TYPES.AdminRepository) private readonly _adminRepository: IAdminRepository,
    @inject(AUTH_TYPES.IEmailService) private readonly _emailVerifyService: IEmailService,
    // @inject(AUTH_TYPES.IJwtProvider) private readonly _jwtProvider: IJwtProvider,
  ) { }

  async execute(data: ResendOtpDTO): Promise<ResendOtpResponseDTO> {
    const admin = await this._adminRepository.findOne({ email: data.email });

    const otp = generateOtp();
    const expiryTime = 5 * 60;
    const expiresAt = Date.now() + expiryTime * 1000;
    // const redisKey = `otp:${data.email}`;

    if (!admin) throw new NotFoundError(ErrorMessage.ADMIN_NOT_FOUND);

    const otpData = await redisClient.hgetall(`otp:${admin.email}`);

    if (otpData) {
      const now = Date.now();

      if (otpData.lastResendAt && now - Number(otpData.lastResendAt) < 30000) {
        throw new AppError(ErrorMessage.RATE_LIMIT_MESSAGE, 429);
      }

      if (Number(otpData.resendCount) >= 5) {
        throw new AppError(ErrorMessage.MAX_RESEND_REACHED, 429);
      }

    }

    await this._emailVerifyService.sendOtpEmail(data.email, otp);

    // const payload: JwtPayload = {
    //   id: admin.id as string,
    //   adminCode: admin.adminCode,
    //   role: admin.role,
    //   email: admin.email,
    // };
    // const accessToken = this._jwtProvider.generateAccessToken(payload);
    // const refreshToken = this._jwtProvider.generateRefreshToken(payload);
    // const key = `refresh_token:${admin.id}`;
    // const ttl = Number(env.REFRESH_EXPIRES_IN);
    // await redisClient.hset(key, "refreshToken", refreshToken);
    // await redisClient.expire(key, ttl);

    return {
      expiresAt,
      resendCount: 0,
      // accessToken,
      // refreshToken,
    };
  }
}
