import type { KycSubmitDTO } from "@application/dto/user/kyc-submit.dto";
import { toEntity } from "@application/mappers/user/kyc.mapper";
import { KycStatusType } from "@domain/enum/users/kyc-status.enum";
import { USER_TYPES } from "@infrastructure/inversify_di/features/user/user.types";
import { ConflictError } from "@presentation/express/utils/error-handling";
import { inject, injectable } from "inversify";
import type { IKycSubmitUseCase } from "../interfaces/kyc-submit-usecase.interface";
import { IUserRepository } from "@application/interfaces/repositories/user/user-repository.interface";
import { IKycRepository } from "@application/interfaces/repositories/user/kyc-repository.interface";

@injectable()
export class KycSubmitUseCase implements IKycSubmitUseCase {
  constructor(
    @inject(USER_TYPES.KycRepository) private readonly _kycRepository: IKycRepository,
    @inject(USER_TYPES.UserRepository) private readonly _userRepository: IUserRepository,
  ) { }

  async execute(data: KycSubmitDTO): Promise<void> {
    const existingKyc = await this._kycRepository.findOne({
      userId: data.userId,
    });
    const newKyc = toEntity(data);

    if (!existingKyc) {
      await this._kycRepository.create(newKyc);
      const kyc = await this._kycRepository.findOne({
        userId: data.userId,
      });
      await this._userRepository.update(data.userId, {
        kycId: kyc?.id,
        kycStatus: KycStatusType.PENDING,
      });
      return;
    }

    if (existingKyc?.status === KycStatusType.REJECTED) {
      await this._kycRepository.update(existingKyc.id as string, newKyc);
      await this._userRepository.update(data.userId, { kycId: newKyc.id });
      return;
    }

    throw new ConflictError("Already submitted");
  }
}
