import type { AdminAuthDTO } from "@application/dto/admin/admin-auth.dto";
import type { AdminAuthReponseDTO } from "@application/dto/admin/admin-auth.response.dto";
import { IAdminRepository } from "@application/interfaces/repositories/admin/admin.repository.interface";
import type { IEmailService } from "@application/interfaces/services/externals/email.service.interface";
import type { IPasswordHashingService } from "@application/interfaces/services/externals/password-hashing.service.interface";
import type { IAdminAuthUseCase } from "@application/use_cases/admin/interfaces/admin-auth-usecase.interface";
import { ErrorMessage } from "@domain/enum/express/messages/error.message";
import { ADMIN_TYPES } from "@infrastructure/inversify_di/types/admin/admin.types";
import { AUTH_TYPES } from "@infrastructure/inversify_di/types/auth/auth.types";
import { redisClient } from "@infrastructure/providers/redis/redis.provider";
import {
  NotFoundError,
  ValidationError,
} from "@presentation/express/utils/error-handling";
import { generateOtp } from "@shared/utils/otp/otp-generator";
import { inject, injectable } from "inversify";

@injectable()
export class AdminAuthUseCase implements IAdminAuthUseCase {
  constructor(
    @inject(ADMIN_TYPES.AdminRepository) private readonly _adminRepository: IAdminRepository,
    @inject(AUTH_TYPES.IPasswordHashingService) private readonly _passwordHashing: IPasswordHashingService,
    @inject(AUTH_TYPES.IEmailService) private readonly _emailVerifyService: IEmailService,
  ) { }

  async execute(data: AdminAuthDTO): Promise<AdminAuthReponseDTO> {
    const isExist = await this._adminRepository.findOne({
      adminCode: data.adminCode,
    });

    if (!isExist) throw new NotFoundError(ErrorMessage.ADMIN_NOT_FOUND);

    const isMatch = await this._passwordHashing.verify(
      data.password,
      isExist.password,
    );
    if (!isMatch) throw new ValidationError(ErrorMessage.INVALID_CREDENTIALS);

    const otp = generateOtp();
    const expiryTime = 5 * 60;
    const expiresAt = Date.now() + expiryTime * 1000;
    const redisKey = `otp:${isExist.email}`;
    const resendCount = 0;
    const now = Date.now();

    await this._emailVerifyService.sendOtpEmail(isExist.email, otp);
    await redisClient.hmset(redisKey, {
      email: isExist.email,
      otp,
      expiresAt,
      resendCount,
      lastResendAt: now,
    });
    await redisClient.expire(redisKey, 300);

    return { expiresAt, resendCount, email: isExist.email };
  }
}
