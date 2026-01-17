export const FEATURE_TYPES = {
    // repositories
    MutualFundRepository: Symbol.for("MutualFundRepository"),
    MutualFundNavRepository: Symbol.for("MutualFundNavRepository"),
    MfCagrRepository: Symbol.for("IMfCagrRepository"),
    InvestmentRepository: Symbol.for("InvestmentRepository"),

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
    InvestmentUseCase: Symbol.for("InvestmentUseCase"),
    NavAllocateUseCase: Symbol.for("NavAllocateUseCase"),
    PortfolioDetailsUseCase: Symbol.for("PortfolioDetailsUseCase"),
    RadeemInvestmentUseCase: Symbol.for("RadeemInvestmentUseCase"),
    ConfirmRedeemUseCase:Symbol.for("ConfirmRadeemUseCase"),
    

    // providers
    NavUpdateProvider: Symbol.for("NavUpdateProvider"),
    HttpClient: Symbol.for("HttpClient"),
    CloudinaryStorageProvider: Symbol.for("CloudinaryStorageProvider"),

    // controllers
    MutualFundsAdminController: Symbol.for("MutualFundsAdminController"),
    MutualFundsUserController: Symbol.for("MutualFundsUserController"),
    PortFolioController: Symbol.for("PortFolioController"),
};
