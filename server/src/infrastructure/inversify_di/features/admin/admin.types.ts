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
  VerifyTransactionUseCase: Symbol.for("VerifyTransactionUseCase"),
  SipManagementUseCase: Symbol.for("SipManagementUseCase"),

  AdminAuthController: Symbol.for("AdminAuthController"),
  AdminController: Symbol.for("AdminController"),
  AdminUserController: Symbol.for("AdminUserController"),
  AdminKycController: Symbol.for("AdminKycController"),
  AdminTransactionsController: Symbol.for("adminTransactionsController"),
  AdminSipController: Symbol.for("AdminSipController"),
  
};
