import type { IForgotPasswordResendOtpUseCase } from "@application/use_cases/auth/interfaces/forgot-pass-resend-otp-usecase.interface";
import type { IForgotPasswordVerifyOtpUseCase } from "@application/use_cases/auth/interfaces/forgot-pass-verify-otp-usecase.interface";
import type { IForgotPasswordUseCase } from "@application/use_cases/auth/interfaces/forgot-password-usecase.interface";
import type { IGoogleAuthUseCase } from "@application/use_cases/auth/interfaces/google-auth.usecase.interface";
import type { IRefreshTokenUseCase } from "@application/use_cases/auth/interfaces/refresh-token-usecase.interface";
import type { IResetPasswordUseCase } from "@application/use_cases/auth/interfaces/reset-password-usecase.interface";
import type { ISignupVerifyOtpUseCase } from "@application/use_cases/auth/interfaces/signup-verify-otp-usecase.interface";
import type { ISignupResendOtpUseCase } from "@application/use_cases/auth/interfaces/singup-resend-otp-usecase.interface";
import type { IUserLoginUseCase } from "@application/use_cases/auth/interfaces/user-login-usecase.interface";
import type { IUserSignupUseCase } from "@application/use_cases/auth/interfaces/user-signup.usecase.interface";
import type { IVerifyTwoFactorUseCase } from "@application/use_cases/auth/interfaces/verify-2fa-usecase.interface";
import { HttpStatus } from "@domain/enum/express/status-code";
import { AUTH_TYPES } from "@infrastructure/inversify_di/features/auth/auth.types";
import { USER_TYPES } from "@infrastructure/inversify_di/features/user/user.types";
import { UnauthorizedError } from "@presentation/express/utils/error-handling";
import { ResponseHelper } from "@presentation/express/utils/response-handling/response.helper";
import { ErrorMessages } from "@shared/constants/error.messages";
import { SuccessMessages } from "@shared/constants/success.messages";
import type { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";

@injectable()
export class AuthController {
  constructor(
    @inject(USER_TYPES.UserSignupUseCase) private readonly _userSignupUseCase: IUserSignupUseCase,
    @inject(USER_TYPES.UserLoginUseCase) private readonly _userLoginUseCase: IUserLoginUseCase,
    @inject(AUTH_TYPES.VerifyTwoFactorUseCase) private readonly _verifyTwoFactorUseCase: IVerifyTwoFactorUseCase,
    @inject(AUTH_TYPES.RefreshTokenUseCase) private readonly _refreshTokenUseCase: IRefreshTokenUseCase,
    @inject(AUTH_TYPES.ForgotPasswordUseCase) private readonly _forgotPasswordUseCase: IForgotPasswordUseCase,
    @inject(AUTH_TYPES.SignupVerifyOtpUseCase) private readonly _verifyOtpUseCase: ISignupVerifyOtpUseCase,
    @inject(AUTH_TYPES.ResendOtpUseCase) private readonly _resendOtpUseCase: ISignupResendOtpUseCase,
    @inject(AUTH_TYPES.ForgotPasswordOtpVerifyUseCase) private readonly _forgotPassVerifyOtp: IForgotPasswordVerifyOtpUseCase,
    @inject(AUTH_TYPES.ForgotPasswordResendOtpUseCase) private readonly _forgotPasswordResendOtp: IForgotPasswordResendOtpUseCase,
    @inject(AUTH_TYPES.ResetPasswordUseCase) private readonly _resetPassword: IResetPasswordUseCase,
    @inject(AUTH_TYPES.GoogleAuthUseCase) private readonly _googleAuthUseCase: IGoogleAuthUseCase,
  ) { }

  async signup(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = { ...req.body };
      const result = await this._userSignupUseCase.execute(dto);

      if (result.isAlreadyCreated) {
        return ResponseHelper.success(
          res,
          SuccessMessages.AUTH.ACCOUNT_EXISTS_NOT_VERIFIED,
          { expiresAt: result.expiresAt },
          HttpStatus.OK,
        );
      }

      return ResponseHelper.success(
        res,
        SuccessMessages.AUTH.OTP_SENT,
        { expiresAt: result.expiresAt },
        HttpStatus.OK,
      );

    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = { ...req.body };
      const result = await this._userLoginUseCase.execute(dto);

      if (result.required2FASetup) {
        return ResponseHelper.success(
          res,
          SuccessMessages.AUTH.TWO_FA_REQUIRED,
          { qrCode: result.qrCode },
          HttpStatus.CREATED,
        );
      }

      return ResponseHelper.success(
        res,
        SuccessMessages.AUTH.VERIFY_2FA_CODE,
        { qrCode: result.qrCode },
        HttpStatus.CREATED,
      );

    } catch (error) {
      next(error);
    }
  }

  async verifyTwoFactor(req: Request, res: Response, next: NextFunction) {
    try {
      const email = req.query.email as string;
      const { token } = { ...req.body };

      const result = await this._verifyTwoFactorUseCase.execute({
        email,
        token,
      });

      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.cookie("accessToken", result.accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: 15 * 60 * 1000, // 15 minutes
      });

      return ResponseHelper.success(
        res,
        SuccessMessages.AUTH.LOGGED_IN,
        { accessToken: "Created" },
        HttpStatus.OK,
      );

    } catch (error) {
      next(error);
    }
  }

  async verifySignupOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = { ...req.body };
      await this._verifyOtpUseCase.execute(dto);

      return ResponseHelper.success(
        res,
        SuccessMessages.AUTH.EMAIL_VERIFIED,
        HttpStatus.OK,
      );

    } catch (err) {
      next(err);
    }
  }

  async resendOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = { ...req.body };
      const result = await this._resendOtpUseCase.execute(dto);

      return ResponseHelper.success(
        res,
        SuccessMessages.AUTH.RESEND_OTP,
        { ...result },
        HttpStatus.OK,
      );

    } catch (err) {
      next(err);
    }
  }

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.cookies.refreshToken;
      console.log("Refresh : ", refreshToken);
      if (!refreshToken) throw new UnauthorizedError(ErrorMessages.AUTH.REFRESH_TOKEN_EXPIRED);

      const result = await this._refreshTokenUseCase.execute({ refreshToken });

      res.cookie("accessToken", result.accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: 15 * 60 * 1000, // 15 minutes
      });

      return ResponseHelper.success(
        res,
        SuccessMessages.AUTH.ACCESS_TOKEN_UPDATED,
        HttpStatus.CREATED,
      );

    } catch (error) {
      next(error);
    }
  }

  async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = { ...req.body };
      await this._forgotPasswordUseCase.execute(dto);

      return ResponseHelper.success(
        res,
        SuccessMessages.AUTH.VERIFICATION_CODE_SENT,
        HttpStatus.OK,
      );
    } catch (error) {
      next(error);
    }
  }

  async forgotPasswordVeirfyOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = { ...req.body };
      const result = await this._forgotPassVerifyOtp.execute(dto);

      return ResponseHelper.success(
        res,
        SuccessMessages.AUTH.OTP_VERIFIED,
        { resetToken: result.resetToken },
        HttpStatus.OK,
      );

    } catch (error) {
      next(error);
    }
  }

  async forgotPasswordResendOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = { ...req.body };
      const { resendCount, expiresAt } = await this._forgotPasswordResendOtp.execute(dto);

      return ResponseHelper.success(
        res,
        SuccessMessages.AUTH.RESEND_OTP,
        { resendCount, expiresAt },
        HttpStatus.OK,
      );

    } catch (err) {
      next(err);
    }
  }

  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = { ...req.body };
      await this._resetPassword.execute(dto);

      return ResponseHelper.success(
        res,
        SuccessMessages.AUTH.PASSWORD_RESET,
        HttpStatus.OK,
      );

    } catch (error) {
      next(error);
    }
  }

  async googleAuth(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = { ...req.body };
      const result = await this._googleAuthUseCase.execute(dto);

      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.cookie("accessToken", result.accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: 15 * 60 * 1000, // 15 minutes
      });

      return ResponseHelper.success(
        res,
        SuccessMessages.AUTH.LOGGED_IN,
        { accessToken: "created", user: result.user },
        HttpStatus.OK,
      );
    } catch (error) {
      next(error);
    }
  }
}
