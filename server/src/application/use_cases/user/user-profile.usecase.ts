import type { UserDTO } from "@application/dto/user/user-dto";
import type { IKycRepository } from "@application/interfaces/repositories/kyc-repository.interface";
import type { IUserRepository } from "@application/interfaces/repositories/user-repository.interface";
import { toUserResponse } from "@application/mappers/user/user.mapper";
import type { KycEntity } from "@domain/entities/kyc.entity";
import type { UserEntity } from "@domain/entities/user.entity";
import { USER_TYPES } from "@infrastructure/inversify_di/types/user/user.types";
import { inject, injectable } from "inversify";
import type { IUserProfileInterface } from "../interfaces/user/user-profile-usecase.interface";

@injectable()
export class GetUserProfileUseCase implements IUserProfileInterface {
  constructor(
    @inject(USER_TYPES.UserRepository) private readonly _userRepository: IUserRepository,
    @inject(USER_TYPES.KycRepository) private readonly _kycRepository: IKycRepository,
  ) { }

/**
 * 
 * @param data
 * @returns 
 */
  
  async execute(data: { userId: string }): Promise<UserDTO> {
    const kycDetails = await this._kycRepository.findOne({
      userId: data.userId,
    });
    const user = await this._userRepository.findById(data.userId as string);
    return toUserResponse(user as UserEntity, kycDetails as KycEntity);
  }
}
