export const FEATURE_TYPES = {
    // repositories
    MutualFundRepository: Symbol.for("MutualFundRepository"),
    MutualFundNavRepository: Symbol.for("MutualFundNavRepository"),
    MfCagrRepository: Symbol.for("IMfCagrRepository"),

    // usecases
    MutualFundUsecase: Symbol.for("MutualFundUseCase"),
    MutualFundNavUpdateUseCase: Symbol.for("MutualFundNavUpdateUseCase"),
    ChangeStatusUseCase: Symbol.for("ChangeStatusUseCase"),
    FetchAllFundUseCases: Symbol.for("FetchAllFundUseCases"),
    ListFundUserSideUseCase: Symbol.for("ListFundUserSideUseCase"),
    MfCagrUseCase: Symbol.for("MfCagrUseCase"),
    MutualFundDetailsUseCase: Symbol.for("MutualFundDetailsUseCase"),
    SignatureUploadUseCase: Symbol.for("SignatureUploadUseCase"),
    NavHistoryUseCase: Symbol.for("NavHistoryUseCase"),


    // providers
    NavUpdateProvider: Symbol.for("NavUpdateProvider"),
    HttpClient: Symbol.for("HttpClient"),
    CloudinaryStorageProvider: Symbol.for("CloudinaryStorageProvider"),

    // controllers
    MutualFundsAdminController: Symbol.for("MutualFundsAdminController"),
    MutualFundsUserController: Symbol.for("MutualFundsUserController"),
};
