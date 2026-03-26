import { AdminAuthUseCase } from "@application/use_cases/admin/auth/admin-auth.usecase";
import { AdminAuthVerifyOtpUseCase } from "@application/use_cases/admin/auth/admin-auth-verify-otp.usecase";
import { AdminLogoutUseCase } from "@application/use_cases/admin/auth/admin-logout.usecase";
import { AdminProfileUseCase } from "@application/use_cases/admin/auth/admin-profile.usecase";
import { AdminRefreshTokenUseCase } from "@application/use_cases/admin/auth/admin-refresh-token.usecase";
import { AdminResendOtpUseCase } from "@application/use_cases/admin/auth/admin-resend-otp-usecase";
import { FetchAllKycDocsUseCase } from "@application/use_cases/admin/kyc-management/fetch-kyc-management.usecase";
import { RejectKycUseCase } from "@application/use_cases/admin/kyc-management/reject-kyc-usecase";
import { VerifyKycUseCase } from "@application/use_cases/admin/kyc-management/verify-kyc-usecase";
import { ViewKycDetailsUseCase } from "@application/use_cases/admin/kyc-management/view-kyc-details.usecase";
import { BlockUserUseCase } from "@application/use_cases/admin/user-management/block-user.usecase";
import { FetchUserDetails } from "@application/use_cases/admin/user-management/fetch-user-details.usecase";
import { UnblockUserUsecase } from "@application/use_cases/admin/user-management/unblock-user.usecase";
import type { IAdminAuthUseCase } from "@application/use_cases/admin/interfaces/admin-auth-usecase.interface";
import type { IAdminAuthVerifyOtpUseCase } from "@application/use_cases/admin/interfaces/admin-auth-verify-otp.interface";
import type { IAdminLogoutUseCase } from "@application/use_cases/admin/interfaces/admin-logout.interface";
import type { IAdminProfileUseCase } from "@application/use_cases/admin/interfaces/admin-profile-usecase.interface";
import type { IRefreshTokenUseCase } from "@application/use_cases/admin/interfaces/admin-refresh-token.interface";
import type { IAdminResendOtpUseCase } from "@application/use_cases/admin/interfaces/admin-resend-otp-usecase-interface";
import type { IBlockUserUseCase } from "@application/use_cases/admin/interfaces/block-user-usecase.interface";
import type { IFetchUserDetails } from "@application/use_cases/admin/interfaces/fetch-user-details.interface";
import type { IFetchAllKycDocsUseCase } from "@application/use_cases/admin/interfaces/kyc-management-usecase.interface";
import type { IRejectKycUseCase } from "@application/use_cases/admin/interfaces/reject-kyc-usecase.interface";
import type { IUnblockUserUsecase } from "@application/use_cases/admin/interfaces/unblock-user-usecase.interface";
import type { IVerifyKycUseCase } from "@application/use_cases/admin/interfaces/verify-kyc-usecase.interface";
import type { IViewKycDetailsUseCase } from "@application/use_cases/admin/interfaces/view-kyc-details-usecase.interface";
import { ADMIN_TYPES } from "./admin.types";
import { AdminController } from "@presentation/http/controllers/admin/admin.controller";
import { AdminAuthController } from "@presentation/http/controllers/admin/admin-auth.controller";
import { AdminKycController } from "@presentation/http/controllers/admin/admin-kyc.controller";
import { AdminUserController } from "@presentation/http/controllers/admin/admin-user.controller";
import { ContainerModule } from "inversify";
import { AdminRepository } from "@infrastructure/databases/repository/admin/admin.repository";
import { IFetchTransactionsUseCase } from "@application/use_cases/admin/interfaces/fetch-transactions-usecase.interface";
import { FetchTransactionsUseCase } from "@application/use_cases/admin/transactions-management/fetch-transactions.usecase";
import { AdminTransactionsController } from "@presentation/http/controllers/admin/admin-transactions.controller";
import { IAdminVerifyTransactionUseCase } from "@application/use_cases/user/interfaces/admin-verify-transaction-usecase.interface";
import { AdminVerifyTransactionUseCase } from "@application/use_cases/admin/transactions-management/admin-verify-transaction.usecase";
import { IAdminRepository } from "@application/interfaces/repositories/admin/admin.repository.interface";
import { AdminSipController } from "@presentation/http/controllers/admin/admin-sip.controller";
import { ISipManagementUseCase } from "@application/use_cases/admin/sip-management/interfaces/sip-management-usecase.interface";
import { SipManagementUseCase } from "@application/use_cases/admin/sip-management/sip-management-usecase";
import { IAdminStocksUseCase } from "@application/use_cases/admin/interfaces/admin-stocks-usecase.interface";
import { AdminStocksUseCase } from "@application/use_cases/admin/stocks-management/admin-stocks.usecase";
import { AdminStocksController } from "@presentation/http/controllers/admin/admin-stocks.controller";
import { AdminAuthMiddleware } from "@presentation/express/middlewares/admin-auth.middleware";

export const AdminModule = new ContainerModule(({ bind }) => {
  //Usecases
  bind<IAdminAuthUseCase>(ADMIN_TYPES.AdminAuthUseCase).to(AdminAuthUseCase);
  bind<IAdminAuthVerifyOtpUseCase>(ADMIN_TYPES.AdminAuthVerifyOtpUseCase).to(AdminAuthVerifyOtpUseCase);
  bind<IRefreshTokenUseCase>(ADMIN_TYPES.AdminRefreshTokenUseCase).to(AdminRefreshTokenUseCase);
  bind<IAdminLogoutUseCase>(ADMIN_TYPES.AdminLogoutUseCase).to(AdminLogoutUseCase);
  bind<IAdminProfileUseCase>(ADMIN_TYPES.AdminProfileUseCase).to(AdminProfileUseCase);
  bind<IAdminResendOtpUseCase>(ADMIN_TYPES.AdminResendOtpUseCase).to(AdminResendOtpUseCase);
  bind<IFetchUserDetails>(ADMIN_TYPES.FetchUserDetails).to(FetchUserDetails);
  bind<IBlockUserUseCase>(ADMIN_TYPES.BlockUserUseCase).to(BlockUserUseCase);
  bind<IUnblockUserUsecase>(ADMIN_TYPES.UnblockUserUsecase).to(UnblockUserUsecase);
  bind<IFetchAllKycDocsUseCase>(ADMIN_TYPES.FetchAllKycDocsUseCase).to(FetchAllKycDocsUseCase);
  bind<IFetchTransactionsUseCase>(ADMIN_TYPES.FetchTransactionsUseCase).to(FetchTransactionsUseCase);
  bind<IViewKycDetailsUseCase>(ADMIN_TYPES.ViewKycDetailsUseCase).to(ViewKycDetailsUseCase);
  bind<IVerifyKycUseCase>(ADMIN_TYPES.VerifyKycUseCase).to(VerifyKycUseCase);
  bind<IRejectKycUseCase>(ADMIN_TYPES.RejectKycUseCase).to(RejectKycUseCase);
  bind<IAdminVerifyTransactionUseCase>(ADMIN_TYPES.VerifyTransactionUseCase).to(AdminVerifyTransactionUseCase);
  bind<ISipManagementUseCase>(ADMIN_TYPES.SipManagementUseCase).to(SipManagementUseCase);
  bind<IAdminStocksUseCase>(ADMIN_TYPES.AdminStocksUseCase).to(AdminStocksUseCase);


  //Repository
  bind<IAdminRepository>(ADMIN_TYPES.AdminRepository).to(AdminRepository);

  bind<AdminAuthController>(ADMIN_TYPES.AdminAuthController).to(AdminAuthController);
  bind<AdminController>(ADMIN_TYPES.AdminController).to(AdminController);
  bind<AdminUserController>(ADMIN_TYPES.AdminUserController).to(AdminUserController);
  bind<AdminKycController>(ADMIN_TYPES.AdminKycController).to(AdminKycController);
  bind<AdminTransactionsController>(ADMIN_TYPES.AdminTransactionsController).to(AdminTransactionsController);
  bind<AdminSipController>(ADMIN_TYPES.AdminSipController).to(AdminSipController);
  bind<AdminStocksController>(ADMIN_TYPES.AdminStocksController).to(AdminStocksController);

  bind<AdminAuthMiddleware>(ADMIN_TYPES.AdminAuthMiddleware).to(AdminAuthMiddleware);
});
