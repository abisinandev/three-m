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

    // providers
    NavUpdateProvider: Symbol.for("NavUpdateProvider"),

    // controllers
    MutualFundsAdminController: Symbol.for("MutualFundsAdminController"),
    MutualFundsUserController: Symbol.for("MutualFundsUserController"),

    // schedulers
    NavDailyScheduler: Symbol.for("NavDailyScheduler"),
    CagrUpdateScheduler: Symbol.for("CagrUpdateScheduler"),
    NavAllocationScheduler: Symbol.for("NavAllocationScheduler"),
};
