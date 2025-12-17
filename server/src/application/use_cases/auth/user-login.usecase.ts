import type { LoginReponseDTO } from "@application/dto/auth/login-response.dto";
import type { UserLoginDTO } from "@application/dto/auth/user-login.dto";
import type { IUserRepository } from "@application/interfaces/repositories/user-repository.interface";
import type { ITwoFactorAuthSetup } from "@application/interfaces/services/externals/2fa-auth-setup.interface";
import type { IPasswordHashingService } from "@application/interfaces/services/externals/password-hashing.service.interface";
import { ErrorMessage } from "@domain/enum/express/messages/error.message";
import { AUTH_TYPES } from "@infrastructure/inversify_di/types/auth/auth.types";
import { USER_TYPES } from "@infrastructure/inversify_di/types/user/user.types";
import {
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
} from "@presentation/express/utils/error-handling";
import { inject, injectable } from "inversify";
import type { IUserLoginUseCase } from "../interfaces/user/user-login-usecase.interface";

@injectable()
export class UserLoginUseCase implements IUserLoginUseCase {
  constructor(
    @inject(USER_TYPES.UserRepository) private readonly _userRepository: IUserRepository,
    @inject(AUTH_TYPES.IPasswordHashingService) private readonly _passwordHashing: IPasswordHashingService,
    @inject(AUTH_TYPES.TwoFactorAuthSetup) private readonly _twoFactorAuthSetup: ITwoFactorAuthSetup,
  ) { }

  async execute(user: UserLoginDTO): Promise<LoginReponseDTO> {
    const existingUser = await this._userRepository.findByField(
      "email",
      user.email as string,
    );

    if (!existingUser) throw new NotFoundError(ErrorMessage.USER_NOT_FOUND);
    if (existingUser.isBlocked) throw new ForbiddenError(ErrorMessage.ACCOUNT_BLOCKED);
    if (!existingUser.isEmailVerified) new ForbiddenError(ErrorMessage.EMAIL_NOT_VERIFIED);

    const isMatch = await this._passwordHashing.verify(
      user.password,
      existingUser.password as string,
    );
    if (!isMatch) throw new UnauthorizedError(ErrorMessage.INVALID_CREDENTIALS);

    if (!existingUser.isTwoFactorEnabled) {

      const { secret, qrCode } = await this._twoFactorAuthSetup.setTwoFactor(
        existingUser.email,
        "three_M",
      );

      await this._userRepository.update(existingUser.id as string, {
        twoFactorSecret: secret,
        qrCodeUrl: qrCode,
        isTwoFactorEnabled: true,
      });

      return { qrCode, required2FASetup: true };
    }

    return {
      qrCode: existingUser.qrCodeUrl as string,
      required2FASetup: false,
    };
  }
}
