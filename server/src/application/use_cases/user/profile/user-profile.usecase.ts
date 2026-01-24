import type { UserDTO } from "@application/dto/user/user-dto";
import { USER_TYPES } from "@infrastructure/inversify_di/types/user/user.types";
import { inject, injectable } from "inversify";
import type { IUserProfileInterface } from "../interfaces/user-profile-usecase.interface";
import { NotFoundError } from "@presentation/express/utils/error-handling";
import { ErrorMessage } from "@domain/enum/express/messages/error.message";
import { toUserResponse } from "@application/mappers/user/user.mapper";
import { IUserRepository } from "@application/interfaces/repositories/user/user-repository.interface";

/**
 * Fetching user profile details with populated data
 * @param data userId
 * @return UserDTO
 */

@injectable()
export class GetUserProfileUseCase implements IUserProfileInterface {
  constructor(
    @inject(USER_TYPES.UserRepository) private readonly _userRepository: IUserRepository,
  ) { }

  async execute(data: { userId: string }): Promise<UserDTO> {
    const user = await this._userRepository.findAllWithRelations(data.userId);
    if (!user) {
      throw new NotFoundError(ErrorMessage.USER_NOT_FOUND);
    }
    return toUserResponse(user)
  }
}
