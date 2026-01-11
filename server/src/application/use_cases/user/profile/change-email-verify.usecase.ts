import { inject, injectable } from "inversify";
import { IChangeEmailVerifyOtpUseCase } from "../../interfaces/user/change-email-verify-usecase.interface";
import { VerifyOtpDTO } from "@application/dto/auth/verify-otp.dto";
import { USER_TYPES } from "@infrastructure/inversify_di/types/user/user.types";
import { redisClient } from "@infrastructure/providers/redis/redis.provider";
import { NotFoundError, ValidationError } from "@presentation/express/utils/error-handling";
import { ErrorMessage } from "@domain/enum/express/messages/error.message";
import { IUserRepository } from "@application/interfaces/repositories/user/user-repository.interface";

@injectable()
export class ChangeEmailVerifyOtpUseCase implements IChangeEmailVerifyOtpUseCase {
    constructor(
        @inject(USER_TYPES.UserRepository) private readonly _userRepository: IUserRepository,
    ) { }

    async execute(userId: string, data: VerifyOtpDTO): Promise<void> {
        const redisKey = `change-email-otp:${data.email}`;
        const storedOtp = await redisClient.hgetall(redisKey);

        if (!storedOtp || !storedOtp.otp) {
            throw new ValidationError(ErrorMessage.OTP_EXPIRED);
        }

        if (Number(storedOtp.expiresAt) < Date.now()) {
            throw new ValidationError(ErrorMessage.OTP_EXPIRED);
        }

        if (storedOtp.otp !== data.otp) {
            throw new ValidationError(ErrorMessage.INVALID_OTP);
        }

        const user = await this._userRepository.findById(userId);
        if (!user) {
            throw new NotFoundError(ErrorMessage.USER_NOT_FOUND);
        }

        await redisClient.del(redisKey);
    }
}