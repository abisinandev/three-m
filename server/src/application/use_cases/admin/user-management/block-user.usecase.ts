import type { IUserRepository } from "@application/interfaces/repositories/user-repository.interface";
import type { IBlockUserUseCase } from "@application/use_cases/interfaces/admin/block-user-usecase.interface";
import { ErrorMessage } from "@domain/enum/express/messages/error.message";
import { USER_TYPES } from "@infrastructure/inversify_di/types/user/user.types";
import {
  NotFoundError,
  ValidationError,
} from "@presentation/express/utils/error-handling";
import { inject, injectable } from "inversify";

@injectable()
export class BlockUserUseCase implements IBlockUserUseCase {
  constructor(
    @inject(USER_TYPES.UserRepository) private readonly _userRepository: IUserRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const user = await this._userRepository.findOne({ userCode: id });
    if (!user) throw new NotFoundError(ErrorMessage.USER_NOT_FOUND);

    if (user.isBlocked)
      throw new ValidationError(ErrorMessage.USER_ALREADY_BLOCKED);

    user.block();
    await this._userRepository.update(user.id as string, user);
    console.log("udpate ", user);
  }
}
