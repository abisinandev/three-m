export const USER_TYPES = {
  // Repository
  UserRepository: Symbol.for("UserRepository"),
  KycRepository: Symbol.for("KycRepository"),

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

  //providers
  SignatureUploadUseCase: Symbol.for("SignatureUploadUseCase"),
  CloudinaryStorageProvider: Symbol.for("CloudinaryStorageProvider"),

  //Controller
  UserController: Symbol.for("UserController"),
};
