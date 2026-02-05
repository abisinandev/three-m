import { ContainerModule } from "inversify";
import { EXTERNAL_TYPES } from "./external.types";
import { SignatureUploadUseCase } from "@application/use_cases/file-upload/signature-upload.usecase";
import { SystemVerifyTransactionUseCase } from "@application/use_cases/admin/transactions-management/system-verify.transaction";
import { AxiosHttpClient } from "@infrastructure/providers/axios/http.client";
import { CloudinaryStorageProvider } from "@infrastructure/providers/storage-providers/cloudinary.provider";
import { InternalTransactionVerificationService } from "@infrastructure/providers/wallet-integrity/internal-transaction-verification.service";
import { ISignatureUploadUseCase } from "@application/use_cases/user/interfaces/signature-upload-usecase.interface";
import { ISystemVerifyTransactionUseCase } from "@application/use_cases/admin/interfaces/system-verify-transaction.interface";
import { IHttpClient } from "@application/interfaces/services/externals/http-client-interface";
import { IStorageProvider } from "@application/interfaces/services/externals/storage-provider.interface";


export const ExternalModule = new ContainerModule(({ bind }) => {
    // UseCases
    bind<ISignatureUploadUseCase>(EXTERNAL_TYPES.SignatureUploadUseCase).to(SignatureUploadUseCase);
    bind<ISystemVerifyTransactionUseCase>(EXTERNAL_TYPES.SystemVerifyTransactionUseCase).to(SystemVerifyTransactionUseCase);

    // Providers
    bind<IHttpClient>(EXTERNAL_TYPES.HttpClient).to(AxiosHttpClient);
    bind<IStorageProvider>(EXTERNAL_TYPES.CloudinaryStorageProvider).to(CloudinaryStorageProvider);
    bind<InternalTransactionVerificationService>(EXTERNAL_TYPES.InternalTransactionVerificationService).to(InternalTransactionVerificationService);
});
