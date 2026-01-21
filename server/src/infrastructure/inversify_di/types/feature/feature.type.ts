export const FEATURE_TYPES = {
    // repositories
    MutualFundRepository: Symbol.for("MutualFundRepository"),
    MutualFundNavRepository: Symbol.for("MutualFundNavRepository"),
    MfCagrRepository: Symbol.for("IMfCagrRepository"),
    InvestmentRepository: Symbol.for("InvestmentRepository"),
    SipRepository: Symbol.for("SipRepository"),
    SipInstallmentRepository: Symbol.for("SipInstallmentRepository"),

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
    ConfirmRedeemUseCase: Symbol.for("ConfirmRadeemUseCase"),
    SipCreationUseCase: Symbol.for("SipCreationUseCase"),
    ExecuteDueSipUseCase: Symbol.for("ExecuteDueSipUseCase"),
    SystemVerifyTransactionUseCase: Symbol.for("SystemVerifyTransactionUseCase"),
    SipDetailsUseCase: Symbol.for("SipDetailsUseCase"),

    // providers
    NavUpdateProvider: Symbol.for("NavUpdateProvider"),
    HttpClient: Symbol.for("HttpClient"),
    CloudinaryStorageProvider: Symbol.for("CloudinaryStorageProvider"),
    InternalTransactionVerificationService: Symbol.for("InternalTransactionVerificationService"),
    // controllers
    MutualFundsAdminController: Symbol.for("MutualFundsAdminController"),
    MutualFundsUserController: Symbol.for("MutualFundsUserController"),
    PortFolioController: Symbol.for("PortFolioController"),
    MutualFundSipController: Symbol.for("MutualFundSipController"),
};
