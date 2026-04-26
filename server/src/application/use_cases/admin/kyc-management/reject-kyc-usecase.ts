import { IKycRepository } from "@application/interfaces/repositories/user/kyc-repository.interface";
import type { IRejectKycUseCase } from "@application/use_cases/admin/kyc-management/interfaces/reject-kyc-usecase.interface";
import { KycStatusType } from "@domain/enum/users/kyc-status.enum";
import { USER_TYPES } from "@infrastructure/inversify_di/features/user/user.types";
import { NotFoundError } from "@presentation/express/utils/error-handling";
import { inject, injectable } from "inversify";

@injectable()
export class RejectKycUseCase implements IRejectKycUseCase {
  constructor(
    @inject(USER_TYPES.KycRepository) private readonly _kycRepository: IKycRepository,
  ) { }

  async execute(data: { kycId: string; reason: string }): Promise<void> {
    const kyc = await this._kycRepository.findById(data.kycId);
    if (!kyc) throw new NotFoundError("Kyc documents not found");

    const updated = await this._kycRepository.updateKycDoc(data.kycId, {
      isKycVerified: false,
      status: KycStatusType.REJECTED,
      rejectionReason: data.reason,
    });

    if (!updated) {
      throw new Error("KYC document not found");
    }
  }
}
