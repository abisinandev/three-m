import type { KycSubmitDTO } from "@application/dto/user/kyc-submit.dto";
import type { IKycRepository } from "@application/interfaces/repositories/kyc-repository.interface";
import type { IUserRepository } from "@application/interfaces/repositories/user-repository.interface";
import { toEntity } from "@application/mappers/user/kyc.mapper";
import { KycStatusType } from "@domain/enum/users/kyc-status.enum";
import { USER_TYPES } from "@infrastructure/inversify_di/types/user/user.types";
import { ConflictError } from "@presentation/express/utils/error-handling";
import { inject, injectable } from "inversify";
import type { IKycSubmitUseCase } from "../interfaces/user/kyc-submit-usecase.interface";

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
