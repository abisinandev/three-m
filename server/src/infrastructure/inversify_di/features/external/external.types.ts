export const EXTERNAL_TYPES = {
    // usecases
    SignatureUploadUseCase: Symbol.for("SignatureUploadUseCase"),

    // providers
    HttpClient: Symbol.for("HttpClient"),
    CloudinaryStorageProvider: Symbol.for("CloudinaryStorageProvider"),
    InternalTransactionVerificationService: Symbol.for("InternalTransactionVerificationService"),
    RedisCacheProvider: Symbol.for("RedisCacheProvider"),
    SystemVerifyTransactionUseCase: Symbol.for("SystemVerifyTransactionUseCase"),
};
