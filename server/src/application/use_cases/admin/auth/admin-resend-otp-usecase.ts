import type { ResendOtpDTO } from "@application/dto/auth/resend-otp.dto";
import type { ResendOtpResponseDTO } from "@application/dto/auth/resend-otp-response.dto";
import type { IEmailService } from "@application/interfaces/services/externals/email.service.interface";
import type { IAdminResendOtpUseCase } from "@application/use_cases/admin/auth/interfaces/admin-resend-otp-usecase-interface";
import { ErrorMessages } from "@shared/constants/error.messages";
import { ADMIN_TYPES } from "@infrastructure/inversify_di/features/admin/admin.types";
import { AUTH_TYPES } from "@infrastructure/inversify_di/features/auth/auth.types";
import { redisClient } from "@infrastructure/providers/redis/redis.provider";
import { NotFoundError } from "@presentation/express/utils/error-handling";
import AppError from "@presentation/express/utils/error-handling/app.error";
import { generateOtp } from "@shared/utils/otp/otp-generator";
import { inject, injectable } from "inversify";
import { IAdminRepository } from "@application/interfaces/repositories/admin/admin.repository.interface";

@injectable()
export class AdminResendOtpUseCase implements IAdminResendOtpUseCase {
  constructor(
    @inject(ADMIN_TYPES.AdminRepository) private readonly _adminRepository: IAdminRepository,
    @inject(AUTH_TYPES.IEmailService) private readonly _emailVerifyService: IEmailService,
  ) { }

  async execute(data: ResendOtpDTO): Promise<ResendOtpResponseDTO> {
    const admin = await this._adminRepository.findOne({ email: data.email });

    const otp = generateOtp();
    const expiryTime = 5 * 60;
    const expiresAt = Date.now() + expiryTime * 1000;

    if (!admin) throw new NotFoundError(ErrorMessages.ADMIN.NOT_FOUND);

    const otpData = await redisClient.hgetall(`otp:${admin.email}`);

    if (otpData) {
      const now = Date.now();

      if (otpData.lastResendAt && now - Number(otpData.lastResendAt) < 30000) {
        throw new AppError(ErrorMessages.AUTH.MAX_RESEND_REACHED, 429);
      }

      if (Number(otpData.resendCount) >= 5) {
        throw new AppError(ErrorMessages.AUTH.MAX_RESEND_REACHED, 429);
      }

    }

    await this._emailVerifyService.sendOtpEmail(data.email, otp);

    return {
      expiresAt,
      resendCount: 0,
    };
  }
}
