import type { ITwoFactorAuthSetup } from "@application/interfaces/services/externals/2fa-auth-setup.interface";
import type { ITwoFactorAuthVerify } from "@application/interfaces/services/externals/2fa-auth-verify.interface";
import type { IEmailService } from "@application/interfaces/services/externals/email.service.interface";
import type { IGoogleAuthService } from "@application/interfaces/services/externals/google-auth.service.interface";
import type { IJwtProvider } from "@application/interfaces/services/externals/jwt.provider.interface";
import type { IPasswordHashingService } from "@application/interfaces/services/externals/password-hashing.service.interface";
import { ForgotPasswordUseCase } from "@application/use_cases/auth/forgot-password.usecase";
import { GoogleAuthUseCase } from "@application/use_cases/auth/google-auth.usecase";
import { RefreshTokenUseCase } from "@application/use_cases/auth/refresh-token.usecase";
import { ResetPasswordUseCase } from "@application/use_cases/auth/reset-password.usecase";
import { VerifyTwoFactorUseCase } from "@application/use_cases/auth/verify-2fa.usecase";
import type { IForgotPasswordResendOtpUseCase } from "@application/use_cases/auth/interfaces/forgot-pass-resend-otp-usecase.interface";
import type { IForgotPasswordVerifyOtpUseCase } from "@application/use_cases/auth/interfaces/forgot-pass-verify-otp-usecase.interface";
import type { IForgotPasswordUseCase } from "@application/use_cases/auth/interfaces/forgot-password-usecase.interface";
import type { IGoogleAuthUseCase } from "@application/use_cases/auth/interfaces/google-auth.usecase.interface";
import type { IRefreshTokenUseCase } from "@application/use_cases/auth/interfaces/refresh-token-usecase.interface";
import type { IResetPasswordUseCase } from "@application/use_cases/auth/interfaces/reset-password-usecase.interface";
import type { ISignupVerifyOtpUseCase } from "@application/use_cases/auth/interfaces/signup-verify-otp-usecase.interface";
import type { ISignupResendOtpUseCase } from "@application/use_cases/auth/interfaces/singup-resend-otp-usecase.interface";
import type { IVerifyTwoFactorUseCase } from "@application/use_cases/auth/interfaces/verify-2fa-usecase.interface";
import { ForgotPasswordResendOtpUseCase } from "@application/use_cases/otp-verification/forgot-pass-otp-resend.usecase";
import { ForgotPasswordOtpVerifyUseCase } from "@application/use_cases/otp-verification/forgot-pass-otp-verify.usecase";
import { ResendOtpUseCase } from "@application/use_cases/otp-verification/signup-resend-otp.usecase";
import { SignupVerifyOtpUseCase } from "@application/use_cases/otp-verification/signup-verify-otp.usecase";
import { AUTH_TYPES } from "./auth.types";
import { TwoFactorAuthSetup } from "@infrastructure/providers/2fa-security/2fa-auth-setup.provider";
import { TwoFactorAuthVerify } from "@infrastructure/providers/2fa-security/2fa-auth-verify.provider";
import { NodeMailerService } from "@infrastructure/providers/email/nodemailor.provider";
import { GoogleAuthService } from "@infrastructure/providers/google-auth/google-auth.service";
import { PasswordHashingService } from "@infrastructure/providers/hashing/password-hashing.provider";
import { JwtProvider } from "@infrastructure/providers/jwt/jwt.provider";
import { AuthMiddleware } from "@presentation/express/middlewares/auth.middleware";
import { AuthController } from "@presentation/http/controllers/auth/auth.controller";
import { ContainerModule } from "inversify";

export const AuthModule = new ContainerModule(({ bind }) => {
  //Providers
  bind<IEmailService>(AUTH_TYPES.IEmailService).to(NodeMailerService);
  bind<IPasswordHashingService>(AUTH_TYPES.IPasswordHashingService).to(PasswordHashingService);
  bind<IJwtProvider>(AUTH_TYPES.IJwtProvider).to(JwtProvider);
  bind<ITwoFactorAuthSetup>(AUTH_TYPES.TwoFactorAuthSetup).to(TwoFactorAuthSetup);
  bind<ITwoFactorAuthVerify>(AUTH_TYPES.TwoFactorAuthVerify).to(TwoFactorAuthVerify);
  bind<IGoogleAuthService>(AUTH_TYPES.GoogleAuthService).to(GoogleAuthService);

  //Usecases
  bind<ISignupVerifyOtpUseCase>(AUTH_TYPES.SignupVerifyOtpUseCase).to(SignupVerifyOtpUseCase);
  bind<ISignupResendOtpUseCase>(AUTH_TYPES.ResendOtpUseCase).to(ResendOtpUseCase);
  bind<IVerifyTwoFactorUseCase>(AUTH_TYPES.VerifyTwoFactorUseCase).to(VerifyTwoFactorUseCase);

  bind<IRefreshTokenUseCase>(AUTH_TYPES.RefreshTokenUseCase).to(RefreshTokenUseCase);

  bind<IForgotPasswordUseCase>(AUTH_TYPES.ForgotPasswordUseCase).to(ForgotPasswordUseCase);

  bind<IForgotPasswordVerifyOtpUseCase>(AUTH_TYPES.ForgotPasswordOtpVerifyUseCase).to(ForgotPasswordOtpVerifyUseCase);

  bind<IForgotPasswordResendOtpUseCase>(AUTH_TYPES.ForgotPasswordResendOtpUseCase).to(ForgotPasswordResendOtpUseCase);

  bind<IResetPasswordUseCase>(AUTH_TYPES.ResetPasswordUseCase).to(ResetPasswordUseCase);

  bind<IGoogleAuthUseCase>(AUTH_TYPES.GoogleAuthUseCase).to(GoogleAuthUseCase);

  //Controllers
  bind<AuthController>(AUTH_TYPES.AuthController).to(AuthController);

  //Middleware
  bind<AuthMiddleware>(AUTH_TYPES.AuthMiddleware).to(AuthMiddleware);
});
