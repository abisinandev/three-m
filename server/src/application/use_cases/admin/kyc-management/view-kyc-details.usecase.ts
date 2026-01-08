import { KycResponseDTO } from "@application/dto/user/kyc-response.dto";
import { IKycRepository } from "@application/interfaces/repositories/user/kyc-repository.interface";
import { IUserRepository } from "@application/interfaces/repositories/user/user-repository.interface";
import { toKycResponse } from "@application/mappers/user/kyc.mapper";
import type { IViewKycDetailsUseCase } from "@application/use_cases/interfaces/admin/view-kyc-details-usecase.interface";
import type { UserEntity } from "@domain/entities/user/user.entity";
import { USER_TYPES } from "@infrastructure/inversify_di/types/user/user.types";
import { inject, injectable } from "inversify";

@injectable()
export class ViewKycDetailsUseCase implements IViewKycDetailsUseCase {
  constructor(
    @inject(USER_TYPES.KycRepository) private readonly _kycRepository: IKycRepository,
    @inject(USER_TYPES.UserRepository) private readonly _userRepository: IUserRepository,
  ) { }

  async execute(kycId: string): Promise<KycResponseDTO> {
    const kyc = await this._kycRepository.findById(kycId);
    const user = await this._userRepository.findById(kyc?.userId as string);
    if (!kyc) {
      throw new Error("KYC not found");
    }
    return toKycResponse(kyc, user as UserEntity);
  }
}
