import { AuthProvider } from "@domain/enum/users/auth-provider.enum";
import type { LoginReponseDTO } from "@application/dto/auth/login-response.dto";
import type { UserLoginDTO } from "@application/dto/auth/user-login.dto";
import type { ITwoFactorAuthSetup } from "@application/interfaces/services/externals/2fa-auth-setup.interface";
import type { IPasswordHashingService } from "@application/interfaces/services/externals/password-hashing.service.interface";
import { ErrorMessages } from "@shared/constants/error.messages";
import { AUTH_TYPES } from "@infrastructure/inversify_di/features/auth/auth.types";
import { USER_TYPES } from "@infrastructure/inversify_di/features/user/user.types";
import {
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
} from "@presentation/express/utils/error-handling";
import { inject, injectable } from "inversify";
import type { IUserLoginUseCase } from "./interfaces/user-login-usecase.interface";
import { IUserRepository } from "@application/interfaces/repositories/user/user-repository.interface";

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

    if (!existingUser) throw new NotFoundError(ErrorMessages.AUTH.USER_NOT_FOUND);
    if (existingUser.isBlocked) throw new ForbiddenError(ErrorMessages.USER.ACCOUNT_BLOCKED);

    if (!existingUser.password) {
      if (existingUser.authProvider !== AuthProvider.MANUAL) {
        throw new UnauthorizedError(`This account was registered using ${existingUser.authProvider}. Please login with your social provider.`);
      }
      throw new UnauthorizedError(ErrorMessages.AUTH.INVALID_CREDENTIALS);
    }

    const isMatch = await this._passwordHashing.verify(
      user.password,
      existingUser.password,
    );
    if (!isMatch) throw new UnauthorizedError(ErrorMessages.AUTH.INVALID_CREDENTIALS);

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
