import { IKycRepository } from "@application/interfaces/repositories/user/kyc-repository.interface";
import { IUserRepository } from "@application/interfaces/repositories/user/user-repository.interface";
import type { IVerifyKycUseCase } from "@application/use_cases/admin/kyc-management/interfaces/verify-kyc-usecase.interface";
import { KycStatusType } from "@domain/enum/users/kyc-status.enum";
import { USER_TYPES } from "@infrastructure/inversify_di/features/user/user.types";
import { NotFoundError } from "@presentation/express/utils/error-handling";
import { inject, injectable } from "inversify";

@injectable()
export class VerifyKycUseCase implements IVerifyKycUseCase {
  constructor(
    @inject(USER_TYPES.KycRepository) private readonly _kycRepository: IKycRepository,
    @inject(USER_TYPES.UserRepository) private readonly _userRepository: IUserRepository,
  ) { }

  async execute(kycId: string): Promise<void> {
    const kyc = await this._kycRepository.findById(kycId);
    if (!kyc) throw new NotFoundError("Kyc documents not found");

    await this._kycRepository.updateKycDoc(kyc?.id as string, {
      isKycVerified: true,
      status: KycStatusType.VERIFIED,
    });
    
    await this._userRepository.update(kyc.userId, {
      kycStatus: KycStatusType.VERIFIED,
      isVerified: true,
    });
  }
}
