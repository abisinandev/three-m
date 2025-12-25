import type { IUserRepository } from "@application/interfaces/repositories/user-repository.interface";
import type { IUnblockUserUsecase } from "@application/use_cases/interfaces/admin/unblock-user-usecase.interface";
import { ErrorMessage } from "@domain/enum/express/messages/error.message";
import { USER_TYPES } from "@infrastructure/inversify_di/types/user/user.types";
import {
  NotFoundError,
  ValidationError,
} from "@presentation/express/utils/error-handling";
import { inject, injectable } from "inversify";

@injectable()
export class UnblockUserUsecase implements IUnblockUserUsecase {
  constructor(
    @inject(USER_TYPES.UserRepository) private readonly _userRepository: IUserRepository,
  ) {}

  async execute(userId: string): Promise<void> {
    const user = await this._userRepository.findById(userId);
    console.log(user,'=======')
    if (!user) throw new NotFoundError(ErrorMessage.USER_NOT_FOUND);

    if (!user.isBlocked)
      throw new ValidationError(ErrorMessage.USER_ALREADY_UNBLOCKED);

    user.unblock();
    await this._userRepository.update(user.id as string, user);
  }
}
