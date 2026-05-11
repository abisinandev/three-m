export const EXTERNAL_TYPES = {
    // usecases
    SignatureUploadUseCase: Symbol.for("SignatureUploadUseCase"),

    // providers
    HttpClient: Symbol.for("HttpClient"),
    CloudinaryStorageProvider: Symbol.for("CloudinaryStorageProvider"),
    RedisCacheProvider: Symbol.for("RedisCacheProvider"),

    IdempotencyService: Symbol.for("IdempotencyService"),

};
