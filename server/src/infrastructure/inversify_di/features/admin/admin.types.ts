export const ADMIN_TYPES = {
  //REPOSITORY
  AdminRepository: Symbol.for("AdminRepository"),

  // Authmiddelware admin
  AdminAuthMiddleware: Symbol.for("AdminAuthMiddleware"),

  //USECASES
  AdminAuthUseCase: Symbol.for("AdminAuthUseCase"),
  AdminAuthVerifyOtpUseCase: Symbol.for("AdminAuthVerifyOtpUseCase"),
  AdminRefreshTokenUseCase: Symbol.for("AdminRefreshTokenUseCase"),
  AdminLogoutUseCase: Symbol.for("AdminLogoutUseCase"),
  AdminProfileUseCase: Symbol.for("AdminProfileUseCase"),
  AdminResendOtpUseCase: Symbol.for("AdminResendOtpUseCase"),
  FetchUserDetails: Symbol.for("FetchUserDetails"),
  BlockUserUseCase: Symbol.for("BlockUserUseCase"),
  UnblockUserUsecase: Symbol.for("UnblockUserUsecase"),
  FetchAllKycDocsUseCase: Symbol.for("FetchAllKycDocsUseCase"),
  ViewKycDetailsUseCase: Symbol.for("ViewKycDetailsUseCase"),
  VerifyKycUseCase: Symbol.for("VerifyKycUseCase"),
  RejectKycUseCase: Symbol.for("RejectKycUseCase"),
  FetchTransactionsUseCase: Symbol.for("FetchTransactionsUseCase"),
  SipManagementUseCase: Symbol.for("SipManagementUseCase"),
  StockManagementUseCase: Symbol.for("StockManagementUseCase"),
  StockUpdateUseCase: Symbol.for("StockUpdateUseCase"),
  SearchStocksUseCase: Symbol.for("SearchStocksUseCase"),
  AddStockUseCase: Symbol.for("AddStockUseCase"),

  // SYSTEM LOGS
  SystemJobLogRepository: Symbol.for("SystemJobLogRepository"),
  JobLoggerService: Symbol.for("JobLoggerService"),
  GetSystemJobLogsUseCase: Symbol.for("GetSystemJobLogsUseCase"),
  GetSystemJobLogDetailUseCase: Symbol.for("GetSystemJobLogDetailUseCase"),

  AdminAuthController: Symbol.for("AdminAuthController"),
  AdminController: Symbol.for("AdminController"),
  AdminUserController: Symbol.for("AdminUserController"),
  AdminKycController: Symbol.for("AdminKycController"),
  AdminTransactionsController: Symbol.for("adminTransactionsController"),
  AdminSipController: Symbol.for("AdminSipController"),
  AdminStocksController: Symbol.for("AdminStocksController"),
  AdminSystemController: Symbol.for("AdminSystemController"),
};
