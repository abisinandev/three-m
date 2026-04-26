import type { ChangePasswordDTO } from "@application/dto/user/change-password.dto";
import type { IPasswordHashingService } from "@application/interfaces/services/externals/password-hashing.service.interface";
import { ErrorMessages } from "@shared/constants/error.messages";
import { AUTH_TYPES } from "@infrastructure/inversify_di/features/auth/auth.types";
import { USER_TYPES } from "@infrastructure/inversify_di/features/user/user.types";
import {
  NotFoundError,
  ValidationError,
} from "@presentation/express/utils/error-handling";
import { inject, injectable } from "inversify";
import type { IChangePasswordUseCase } from "./interfaces/change-password.usecase.interface";
import { IUserRepository } from "@application/interfaces/repositories/user/user-repository.interface";

@injectable()
export class ChangePasswordUseCase implements IChangePasswordUseCase {
  constructor(
    @inject(USER_TYPES.UserRepository) private readonly _userRepository: IUserRepository,
    @inject(AUTH_TYPES.IPasswordHashingService) private readonly _hashingService: IPasswordHashingService,
  ) { }

  async execute(dto: {
    userId: string;
    data: ChangePasswordDTO;
  }): Promise<void> {
    const { userId, data } = dto;
    const user = await this._userRepository.findById(userId);

    if (!user) throw new NotFoundError(ErrorMessages.AUTH.USER_NOT_FOUND);

    const isMatch = await this._hashingService.verify(
      data.currentPassword,
      user.password as string,
    );
    if (!isMatch) throw new ValidationError(ErrorMessages.AUTH.INVALID_OLD_PASSWORD);

    const newHashedPassword = await this._hashingService.hash(data.newPassword);
    await this._userRepository.updatePassword(userId, newHashedPassword);
  }
}
