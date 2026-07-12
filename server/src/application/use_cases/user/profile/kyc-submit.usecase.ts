import type { KycSubmitDTO } from "@application/dto/user/kyc-submit.dto";
import { toEntity } from "@application/mappers/user/kyc.mapper";
import { KycStatusType } from "@domain/enum/users/kyc-status.enum";
import { USER_TYPES } from "@infrastructure/inversify_di/features/user/user.types";
import { EXTERNAL_TYPES } from "@infrastructure/inversify_di/features/external/external.types";
import { ConflictError, ValidationError } from "@presentation/express/utils/error-handling";
import { inject, injectable } from "inversify";
import type { IKycSubmitUseCase } from "./interfaces/kyc-submit-usecase.interface";
import { IUserRepository } from "@application/interfaces/repositories/user/user-repository.interface";
import { IKycRepository } from "@application/interfaces/repositories/user/kyc-repository.interface";
import { IStorageProvider } from "@application/interfaces/services/externals/storage-provider.interface";
import { ErrorMessages } from "@shared/constants/error.messages";
import { fileUploadValidator } from "@shared/utils/file-upload-validator.util";

@injectable()
export class KycSubmitUseCase implements IKycSubmitUseCase {
  constructor(
    @inject(USER_TYPES.KycRepository) private readonly _kycRepository: IKycRepository,
    @inject(USER_TYPES.UserRepository) private readonly _userRepository: IUserRepository,
    @inject(EXTERNAL_TYPES.CloudinaryStorageProvider) private readonly _storageProvider: IStorageProvider,
  ) { }

  async execute(userId: string, data: KycSubmitDTO): Promise<void> {
    const maxSizeBytes = 5 * 1024 * 1024; // 5MB
    const allowedFormats = ["jpg", "jpeg", "png", "webp"];

    try {
      for (const doc of data.documents) {
        fileUploadValidator(doc.fileUrl, doc.publicId);

        const castedDoc = doc;
        if (castedDoc.resourceType !== 'image') {
          throw new ValidationError(ErrorMessages.KYC.UNSUPPORTED_DOCUMENT);
        }
        if (!allowedFormats.includes(castedDoc.format)) {
          throw new ValidationError(ErrorMessages.KYC.UNSUPPORTED_FORMAT);
        }
        if (castedDoc.bytes > maxSizeBytes) {
          throw new ValidationError(ErrorMessages.KYC.FILE_TOO_LARGE);
        }

        const asset = await this._storageProvider.verifyAsset(doc.publicId);
        if (!asset) {
          throw new ValidationError(ErrorMessages.KYC.FILE_NOT_FOUND);
        }
        if (asset.resource_type !== 'image' || !allowedFormats.includes(asset.format) || asset.bytes > maxSizeBytes) {
          throw new ValidationError(ErrorMessages.KYC.METADATA_VERIFICATION_FAILED);
        }
      }

      const existingKyc = await this._kycRepository.findOne({
        userId
      });
      const newKyc = toEntity(userId, data);

      if (!existingKyc) {
        await this._kycRepository.create(newKyc);
        const kyc = await this._kycRepository.findOne({
          userId
        });
        await this._userRepository.update(userId, {
          kycId: kyc?.id,
          kycStatus: KycStatusType.PENDING,
        });
        return;
      }

      if (existingKyc?.status === KycStatusType.REJECTED) {
        if (existingKyc.submissionCount >= 3) {
          throw new ValidationError(ErrorMessages.KYC.MAX_ATTEMPTS_REACHED);
        }

        newKyc.incrementSubmissionCount();

        await this._kycRepository.update(existingKyc.id as string, newKyc);
        await this._userRepository.update(userId, {
          kycId: existingKyc.id,
          kycStatus: KycStatusType.PENDING
        });
        return;
      }

      throw new ConflictError(ErrorMessages.VALIDATION.ALREADY_SUBMITTED);
    } catch (error) {
      for (const doc of data.documents) {
        if (doc.publicId) {
          await this._storageProvider.deleteAsset(doc.publicId);
        }
      }
      throw error;
    }
  }
}
