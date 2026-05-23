import type { UserMeResponseDTO } from "@application/dto/user/user-me-response.dto";
import { USER_TYPES } from "@infrastructure/inversify_di/features/user/user.types";
import { inject, injectable } from "inversify";
import type { IUserProfileInterface } from "./interfaces/user-profile-usecase.interface";
import { NotFoundError } from "@presentation/express/utils/error-handling";
import { ErrorMessages } from "@shared/constants/error.messages";
import { toUserMeResponse } from "@application/mappers/user/user.mapper";
import { IUserRepository } from "@application/interfaces/repositories/user/user-repository.interface";
import type { IKycRepository } from "@application/interfaces/repositories/user/kyc-repository.interface";
import type { IWalletRepository } from "@application/interfaces/repositories/user/wallet-repository.interface";

@injectable()
export class GetUserProfileUseCase implements IUserProfileInterface {
  constructor(
    @inject(USER_TYPES.UserRepository) private readonly _userRepository: IUserRepository,
    @inject(USER_TYPES.KycRepository) private readonly _kycRepository: IKycRepository,
    @inject(USER_TYPES.WalletRepository) private readonly _walletRepository: IWalletRepository,
  ) { }

  async execute(data: { userId: string }): Promise<UserMeResponseDTO> {
    const user = await this._userRepository.findById(data.userId);
    if (!user) {
      throw new NotFoundError(ErrorMessages.AUTH.USER_NOT_FOUND);
    }

    const [kyc, wallet] = await Promise.all([
      user.kycId ? this._kycRepository.findById(user.kycId) : null,
      user.walletId ? this._walletRepository.findById(user.walletId) : null,
    ]);

    return toUserMeResponse(user, kyc, wallet);
  }
}
