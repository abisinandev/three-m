export const AUTH_TYPES = {
  // Controllers
  AuthController: Symbol.for("AuthController"),

  // Interfaces
  IEmailService: Symbol.for("IEmailService"),
  IPasswordHashingService: Symbol.for("IPasswordHashingService"),
  IJwtProvider: Symbol.for("IJwtProvider"),
  GoogleAuthService: Symbol.for("GoogleAuthService"),
  // Use Cases
  SignupVerifyOtpUseCase: Symbol.for("SignupVerifyOtpUseCase"),
  ResendOtpUseCase: Symbol.for("ResendOtpUseCase"),
  RefreshTokenUseCase: Symbol.for("RefreshTokenUseCase"),
  ForgotPasswordUseCase: Symbol.for("ForgotPasswordUseCase"),
  ForgotPasswordOtpVerifyUseCase: Symbol.for("ForgotPasswordOtpVerifyUseCase"),
  ForgotPasswordResendOtpUseCase: Symbol.for("ForgotPasswordResendOtpUseCase"),
  ResetPasswordUseCase: Symbol.for("ResetPasswordUseCase"),
  GoogleAuthUseCase: Symbol.for("GoogleAuthUseCase"),

  //Providers
  TwoFactorAuthSetup: Symbol.for("TwoFactorAuthSetup"),
  TwoFactorAuthVerify: Symbol.for("TwoFactorAuthVerify"),
  VerifyTwoFactorUseCase: Symbol.for("VerifyTwoFactorUseCase"),

  //Middleware
  AuthMiddleware: Symbol.for("AuthMiddleware"),
};
