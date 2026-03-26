export const USER_TYPES = {
  // Repository
  UserRepository: Symbol.for("UserRepository"),
  KycRepository: Symbol.for("KycRepository"),
  WalletRepository: Symbol.for("WalletRepository"),
  BlockRepository: Symbol.for("BlockRepository"),
  TransactionRepository: Symbol.for("TransactionRepository"),

  //Usecases
  UserSignupUseCase: Symbol.for("UserSignupUseCase"),
  UserLoginUseCase: Symbol.for("UserLoginUseCase"),
  GetUserProfileUseCase: Symbol.for("GetUserProfileUseCase"),
  ChangePasswordUseCase: Symbol.for("ChangePasswordUseCase"),
  LogoutUseCase: Symbol.for("LogoutUseCase"),
  CheckUserBlockedUseCase: Symbol.for("CheckUserBlockedUseCase"),
  KycSubmitUseCase: Symbol.for("KycSubmitUseCase"),
  EditProfileUseCase: Symbol.for("EditProfileUseCase"),
  ChangeEmailVerifyOtpUseCase: Symbol.for(" ChangeEmailVerifyOtpUseCase"),
  ChangeEmailSendOtpUseCase: Symbol.for('ChangeEmailSendOtpUseCase'),
  ProfileImageUploadUseCase: Symbol.for("ProfileImageUploadUseCase"),
  UserWalletUseCase: Symbol.for('UserWalletUseCase'),
  AddToWalletUseCase: Symbol.for("AddToWalletUseCase"),
  GetUserStocksUseCase: Symbol.for("GetUserStocksUseCase"),



  //Controller
  UserController: Symbol.for("UserController"),
  WalletController: Symbol.for('WalletController'),
  PaymentController: Symbol.for("PaymentController"),
  WebhookController: Symbol.for("WebhookController"),
  StripePaymentHandler: Symbol.for('StripePaymentHandler'),
  UserStocksController: Symbol.for("UserStocksController"),
};
