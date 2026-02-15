import { ErrorMessages } from "@shared/constants/error.messages";
import type { UserRepository } from "@infrastructure/databases/repository/user/user.repository";
import { USER_TYPES } from "@infrastructure/inversify_di/features/user/user.types";
import { NotFoundError } from "@presentation/express/utils/error-handling";
import { inject, injectable } from "inversify";
import type { ICheckUserBlockedUseCase } from "./interfaces/check-user-blocked-usecase.interface";

@injectable()
export class CheckUserBlockedUseCase implements ICheckUserBlockedUseCase {
  constructor(
    @inject(USER_TYPES.UserRepository) private readonly _userRepository: UserRepository,
  ) { }

  async execute(id: string): Promise<boolean> {
    const user = await this._userRepository.findById(id);
    if (!user) throw new NotFoundError(ErrorMessages.AUTH.USER_NOT_FOUND);
    return user.isBlocked;
  }
}
