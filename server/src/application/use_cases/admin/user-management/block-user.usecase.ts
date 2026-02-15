import { IUserRepository } from "@application/interfaces/repositories/user/user-repository.interface";
import type { IBlockUserUseCase } from "@application/use_cases/admin/interfaces/block-user-usecase.interface";
import { ErrorMessages } from "@shared/constants/error.messages";
import { USER_TYPES } from "@infrastructure/inversify_di/features/user/user.types";
import {
  NotFoundError,
  ValidationError,
} from "@presentation/express/utils/error-handling";
import { inject, injectable } from "inversify";

@injectable()
export class BlockUserUseCase implements IBlockUserUseCase {
  constructor(
    @inject(USER_TYPES.UserRepository) private readonly _userRepository: IUserRepository,
  ) { }

  async execute(userId: string): Promise<void> {
    const user = await this._userRepository.findById(userId);
    if (!user) throw new NotFoundError(ErrorMessages.AUTH.USER_NOT_FOUND);

    if (user.isBlocked)
      throw new ValidationError(ErrorMessages.USER.ALREADY_BLOCKED);

    user.block();
    await this._userRepository.update(user.id as string, user);
  }
}
