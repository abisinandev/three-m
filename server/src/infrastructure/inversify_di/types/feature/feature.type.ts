export const FEATURE_TYPES = {
    //repositories
    MutualFundRepository: Symbol.for("MutualFundRepository"),
    MutualFundNavRepsitory: Symbol.for("MutualFundNavRepsitory"),
    MfCagrRepository: Symbol.for("IMfCagrRepository"),

    //usecases
    MutualFundUsecase: Symbol.for("MutualFundUseCase"),
    SignatureUploadUseCase: Symbol.for("SignatureUploadUseCase"),
    FetchAllFundUseCases: Symbol.for("FetchAllFundUseCases"),
    MutualFundNavUpdate: Symbol.for("MutualFundNavUpdate"),
    ChangeStatusUseCase: Symbol.for("ChangeStatusUseCase"),
    ListFundUserSideUseCase: Symbol.for("ListFundUserSideUseCase"),
    MfCagrUseCase: Symbol.for("MfCagrUseCase"),

    MfApiClient: Symbol.for("MfApiClient"),
    HttpClient: Symbol.for("HttpClient"),

    //Controllers
    MutualFundsAdminController: Symbol.for("MutualFundsAdminController"),
    MutualFundsUserController: Symbol.for("MutualFundsUserController"),

    //Providers
    MutualFundsProvider: Symbol.for("MutualFundsProvider"),
    CloudinaryStorageProvider: Symbol.for("CloudinaryStorageProvider"),
    NavUpdateProvider: Symbol.for("NavUpdateProvider"),


}