export const EXTERNAL_TYPES = {
    // usecases
    SignatureUploadUseCase: Symbol.for("SignatureUploadUseCase"),
    SystemVerifyTransactionUseCase: Symbol.for("SystemVerifyTransactionUseCase"),

    // providers
    HttpClient: Symbol.for("HttpClient"),
    CloudinaryStorageProvider: Symbol.for("CloudinaryStorageProvider"),
    InternalTransactionVerificationService: Symbol.for("InternalTransactionVerificationService"),
};
