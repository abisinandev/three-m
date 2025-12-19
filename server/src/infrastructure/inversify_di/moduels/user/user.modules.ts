import type { IKycRepository } from "@application/interfaces/repositories/kyc-repository.interface";
import type { IUserRepository } from "@application/interfaces/repositories/user-repository.interface";
import type { IStorageProvider } from "@application/interfaces/services/externals/storage-provider.interface";
import { UserLoginUseCase } from "@application/use_cases/auth/user-login.usecase";
import { LogoutUseCase } from "@application/use_cases/auth/user-logout.usecase";
import { UserSignupUseCase } from "@application/use_cases/auth/user-signup.usecase";
import type { IChangePasswordUseCase } from "@application/use_cases/interfaces/user/change-password.usecase.interface";
import type { ICheckUserBlockedUseCase } from "@application/use_cases/interfaces/user/check-user-blocked-usecase.interface";
import type { IKycSubmitUseCase } from "@application/use_cases/interfaces/user/kyc-submit-usecase.interface";
import type { ISignatureUploadUseCase } from "@application/use_cases/interfaces/user/signature-upload-usecase.interface";
import type { IUserLoginUseCase } from "@application/use_cases/interfaces/user/user-login-usecase.interface";
import type { IUserLogoutUseCase } from "@application/use_cases/interfaces/user/user-logout-usecase.interface";
import type { IUserProfileInterface } from "@application/use_cases/interfaces/user/user-profile-usecase.interface";
import type { IUserSignupUseCase } from "@application/use_cases/interfaces/user/user-signup.usecase.interface";
import { ChangePasswordUseCase } from "@application/use_cases/user/change-password.usecase";
import { CheckUserBlockedUseCase } from "@application/use_cases/user/check-user-blocked.usecase";
import { KycSubmitUseCase } from "@application/use_cases/user/kyc-submit.usecase";
import { SignatureUploadUseCase } from "@application/use_cases/user/signature-upload.usecase";
import { GetUserProfileUseCase } from "@application/use_cases/user/user-profile.usecase";
import { KycRepository } from "@infrastructure/databases/repository/user/kyc-repository";
import { UserRepository } from "@infrastructure/databases/repository/user/user.repository";
import { CloudinaryStorageProvider } from "@infrastructure/providers/storage-providers/cloudinary.provider";
import { UserController } from "@presentation/http/controllers/user/user.controller";
import { ContainerModule } from "inversify";
import { USER_TYPES } from "../../types/user/user.types";
import { IEditProfileUseCase } from "@application/use_cases/interfaces/user/edit-profile-usecase.interface";
import { EditProfileUseCase } from "@application/use_cases/user/edit-profile.usecase";
import { IChangeEmailSendOtpUseCase } from "@application/use_cases/interfaces/user/change-email-usecase.interface";
import { ChangeEmailSendOtpUseCase } from "@application/use_cases/user/change-email-send-otp.usecase";
import { IChangeEmailVerifyOtpUseCase } from "@application/use_cases/interfaces/user/change-email-verify-usecase.interface";
import { ChangeEmailVerifyOtpUseCase } from "@application/use_cases/user/change-email-verify.usecase";
import { IProfileImageUploadUseCase } from "@application/use_cases/interfaces/user/profile-image-upload-usecase.interface";
import { ProfileImageUploadUseCase } from "@application/use_cases/user/profile-image-upload.usecase";
import { IWalletRepository } from "@application/interfaces/repositories/wallet-repository.interface";
import { WalletRepository } from "@infrastructure/databases/repository/user/wallet.repository";
import { IUserWalletUseCase } from "@application/use_cases/interfaces/user/user-wallet-usecase.interface";
import { UserWalletUseCase } from "@application/use_cases/user/user-wallet.usecase";
import { WalletController } from "@presentation/http/controllers/wallet/wallet.controller";
import { ITransactionRepository } from "@application/interfaces/repositories/transaction-repository.interface";
import { TransactionRepository } from "@infrastructure/databases/repository/user/transaction.repository";
import { IBlockRepository } from "@application/interfaces/repositories/block-repository.interface";
import { BlockRepository } from "@infrastructure/databases/repository/user/block.repository";
import { AddToWalletUseCase } from "@application/use_cases/user/add-to-wallet.usecase";
import { IAddToWalletUseCase } from "@application/use_cases/interfaces/user/add-to-wallet-usecase.interface";
import { PaymentController } from "@presentation/http/controllers/payment/payment.controller";
 
import { StripePaymentHandler } from "@shared/utils/payments/payment.handler";
import { WebhookController } from "@presentation/http/controllers/payment/webhook.controller";

export const UserModule = new ContainerModule(({ bind }) => {
  //Repository
  bind<IUserRepository>(USER_TYPES.UserRepository).to(UserRepository);
  bind<IKycRepository>(USER_TYPES.KycRepository).to(KycRepository);
  bind<IWalletRepository>(USER_TYPES.WalletRepository).to(WalletRepository);

  //Controller
  bind<UserController>(USER_TYPES.UserController).to(UserController);
  bind<WalletController>(USER_TYPES.WalletController).to(WalletController);
  bind<PaymentController>(USER_TYPES.PaymentController).to(PaymentController)
  bind<WebhookController>(USER_TYPES.WebhookController).to(WebhookController),

    //Usecases
  bind<IUserLoginUseCase>(USER_TYPES.UserLoginUseCase).to(UserLoginUseCase);
  bind<IUserSignupUseCase>(USER_TYPES.UserSignupUseCase).to(UserSignupUseCase);
  bind<IUserProfileInterface>(USER_TYPES.GetUserProfileUseCase).to(GetUserProfileUseCase);
  bind<IChangePasswordUseCase>(USER_TYPES.ChangePasswordUseCase).to(ChangePasswordUseCase);
  bind<IUserLogoutUseCase>(USER_TYPES.LogoutUseCase).to(LogoutUseCase);
  bind<ICheckUserBlockedUseCase>(USER_TYPES.CheckUserBlockedUseCase).to(CheckUserBlockedUseCase);
  bind<ISignatureUploadUseCase>(USER_TYPES.SignatureUploadUseCase).to(SignatureUploadUseCase);
  bind<IStorageProvider>(USER_TYPES.CloudinaryStorageProvider).to(CloudinaryStorageProvider);
  bind<IKycSubmitUseCase>(USER_TYPES.KycSubmitUseCase).to(KycSubmitUseCase);
  bind<IEditProfileUseCase>(USER_TYPES.EditProfileUseCase).to(EditProfileUseCase);
  bind<IChangeEmailSendOtpUseCase>(USER_TYPES.ChangeEmailSendOtpUseCase).to(ChangeEmailSendOtpUseCase);
  bind<IChangeEmailVerifyOtpUseCase>(USER_TYPES.ChangeEmailVerifyOtpUseCase).to(ChangeEmailVerifyOtpUseCase);
  bind<IProfileImageUploadUseCase>(USER_TYPES.ProfileImageUploadUseCase).to(ProfileImageUploadUseCase);
  bind<IUserWalletUseCase>(USER_TYPES.UserWalletUseCase).to(UserWalletUseCase);
  bind<ITransactionRepository>(USER_TYPES.TransactionRepository).to(TransactionRepository);
  bind<IBlockRepository>(USER_TYPES.BlockRepository).to(BlockRepository);
  bind<IAddToWalletUseCase>(USER_TYPES.AddToWalletUseCase).to(AddToWalletUseCase);
  bind<StripePaymentHandler>(USER_TYPES.StripePaymentHandler).to(StripePaymentHandler);
});
