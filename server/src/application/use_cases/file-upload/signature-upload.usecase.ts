import type { SignatureUploadDTO } from "@application/dto/user/signature-upload.dto";
import type { signatureUploadResponseDTO } from "@application/dto/user/signature-upload-response.dto";
import type { IStorageProvider } from "@application/interfaces/services/externals/storage-provider.interface";
import { inject, injectable } from "inversify";
import type { ISignatureUploadUseCase } from "../user/interfaces/signature-upload-usecase.interface";
import { EXTERNAL_TYPES } from "@infrastructure/inversify_di/features/external/external.types";

@injectable()
export class SignatureUploadUseCase implements ISignatureUploadUseCase {
  constructor(
    @inject(EXTERNAL_TYPES.CloudinaryStorageProvider) private readonly _cloudinaryStorage: IStorageProvider,
  ) {}

  async execute(data: SignatureUploadDTO): Promise<signatureUploadResponseDTO> {
    return await this._cloudinaryStorage.getSignedUploadUrl(
      data.folder,
      data.userId,
    );
  }
}
