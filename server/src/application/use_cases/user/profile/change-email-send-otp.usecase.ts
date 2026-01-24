import { inject, injectable } from "inversify";
import { IChangeEmailSendOtpUseCase } from "../interfaces/change-email-usecase.interface";
import { ChangeEmailDTO } from "@application/dto/user/change-email.dto";
import { USER_TYPES } from "@infrastructure/inversify_di/types/user/user.types";
import { AUTH_TYPES } from "@infrastructure/inversify_di/types/auth/auth.types";
import { IEmailService } from "@application/interfaces/services/externals/email.service.interface";
import { NotFoundError } from "@presentation/express/utils/error-handling";
import { generateOtp } from "@shared/utils/otp/otp-generator";
import { redisClient } from "@infrastructure/providers/redis/redis.provider";
import { IUserRepository } from "@application/interfaces/repositories/user/user-repository.interface";

@injectable()
export class ChangeEmailSendOtpUseCase implements IChangeEmailSendOtpUseCase {

    constructor(
        @inject(USER_TYPES.UserRepository) private readonly _userRepository: IUserRepository,
        @inject(AUTH_TYPES.IEmailService) private readonly _emailService: IEmailService,
    ) { }
    async execute(userId: string, data: ChangeEmailDTO): Promise<void> {
        const user = await this._userRepository.findById(userId);
        if (!user) throw new NotFoundError("User doest not exist");

        const redisKey = `change-email-otp:${data.email}`;
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