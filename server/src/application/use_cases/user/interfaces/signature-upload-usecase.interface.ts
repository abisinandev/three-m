import type { SignatureUploadDTO } from "@application/dto/user/signature-upload.dto";
import type { signatureUploadResponseDTO } from "@application/dto/user/signature-upload-response.dto";

export interface ISignatureUploadUseCase {
  execute(data: SignatureUploadDTO): Promise<signatureUploadResponseDTO>;
}
