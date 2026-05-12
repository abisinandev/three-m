export const MUTUAL_FUND_TYPES = {
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
    NavHistoryUseCase: Symbol.for("NavHistoryUseCase"),
    InvestmentUseCase: Symbol.for("InvestmentUseCase"),
    NavAllocateUseCase: Symbol.for("NavAllocateUseCase"),
    MfInvestmentHistoryUseCase: Symbol.for("MfInvestmentHistoryUseCase"),
    SyncSingleFundNavUseCase: Symbol.for("SyncSingleFundNavUseCase"),

    // providers
    NavUpdateProvider: Symbol.for("NavUpdateProvider"),
    NavUpdateQueue: Symbol.for("NavUpdateQueue"),
    NavUpdateWorker: Symbol.for("NavUpdateWorker"),

    // controllers
    MutualFundsAdminController: Symbol.for("MutualFundsAdminController"),
    MutualFundsUserController: Symbol.for("MutualFundsUserController"),

    // schedulers
    NavDailyScheduler: Symbol.for("NavDailyScheduler"),
    CagrUpdateScheduler: Symbol.for("CagrUpdateScheduler"),
    NavAllocationScheduler: Symbol.for("NavAllocationScheduler"),
    InvestmentValidationService: Symbol.for("InvestmentValidationService"),
};
