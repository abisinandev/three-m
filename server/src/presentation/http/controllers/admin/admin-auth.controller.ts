import type { IAdminAuthUseCase } from "@application/use_cases/admin/auth/interfaces/admin-auth-usecase.interface";
import type { IAdminAuthVerifyOtpUseCase } from "@application/use_cases/admin/auth/interfaces/admin-auth-verify-otp.interface";
import type { IAdminLogoutUseCase } from "@application/use_cases/admin/auth/interfaces/admin-logout.interface";
import type { IRefreshTokenUseCase } from "@application/use_cases/admin/auth/interfaces/admin-refresh-token.interface";
import type { IAdminResendOtpUseCase } from "@application/use_cases/admin/auth/interfaces/admin-resend-otp-usecase-interface";
import { SuccessMessage } from "@domain/enum/express/messages/success.message";
import { HttpStatus } from "@domain/enum/express/status-code";
import { ADMIN_TYPES } from "@infrastructure/inversify_di/features/admin/admin.types";
import { ValidationError } from "@presentation/express/utils/error-handling";
import { ResponseHelper } from "@presentation/express/utils/response-handling/response.helper";
import type { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";

@injectable()
export class AdminAuthController {
  constructor(
    @inject(ADMIN_TYPES.AdminAuthUseCase) private readonly _adminAuthUseCase: IAdminAuthUseCase,
    @inject(ADMIN_TYPES.AdminAuthVerifyOtpUseCase) private readonly _adminVerifyOtpUseCase: IAdminAuthVerifyOtpUseCase,
    @inject(ADMIN_TYPES.AdminRefreshTokenUseCase) private readonly _refreshToken: IRefreshTokenUseCase,
    @inject(ADMIN_TYPES.AdminLogoutUseCase) private readonly _adminLogoutUseCase: IAdminLogoutUseCase,
    @inject(ADMIN_TYPES.AdminResendOtpUseCase) private readonly _adminResendOtpUsecase: IAdminResendOtpUseCase,
  ) { }

  async authentication(req: Request, res: Response, next: NextFunction) {
    try {
      const { expiresAt, resendCount, email } =
        await this._adminAuthUseCase.execute(req.body);

      return ResponseHelper.success(
        res,
        SuccessMessage.OTP_SEND,
        { expiresAt, resendCount, email },
        HttpStatus.OK
      );
    } catch (error) {
      next(error);
    }
  }

  async veirfyOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = { ...req.body };
      const result = await this._adminVerifyOtpUseCase.execute(dto);

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
        SuccessMessage.AUTHENTICATION_DONE,
        { accessToken: "created" },
        HttpStatus.OK
      );

    } catch (error) {
      next(error);
    }
  }

  async resendOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = { ...req.body };
      await this._adminResendOtpUsecase.execute(dto);

      // res.cookie("refreshToken", result.refreshToken, {
      //   httpOnly: true,
      //   secure: true,
      //   sameSite: "lax",
      //   maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      // });

      // res.cookie("accessToken", result.accessToken, {
      //   httpOnly: true,
      //   secure: true,
      //   sameSite: "lax",
      //   maxAge: 15 * 60 * 1000, // 15 minutes
      // });

      // res.status(HttpStatus.OK).json({
      //   success: true,
      //   message: SuccessMessage.AUTHENTICATION_DONE,
      //   // data: { accessToken: "created" },
      // });

      return ResponseHelper.success(
        res,
        SuccessMessage.AUTHENTICATION_DONE,
        { accessToken: "created" },
        HttpStatus.OK,
      );

    } catch (error) {
      next(error);
    }
  }

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.cookies.refreshToken;
      console.log("Refresh : ", refreshToken);
      if (!refreshToken) throw new ValidationError("No refresh token provided");

      const { accessToken } = await this._refreshToken.execute({
        refreshToken,
      });
      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: 15 * 60 * 1000, // 15 minutes
      });

      return ResponseHelper.success(
        res,
        SuccessMessage.ACCESS_TOKEN_UPDATED,
        HttpStatus.OK,
      );

    } catch (error) {
      next(error);
    }
  }

  logout(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.user?.id;
      if (id) {
        this._adminLogoutUseCase.execute({ id });
      }
      res.clearCookie("accessToken", { httpOnly: true, sameSite: "lax" });
      res.clearCookie("refreshToken", { httpOnly: true, sameSite: "lax" });

      return ResponseHelper.success(
        res,
        SuccessMessage.LOGGED_OUT,
        HttpStatus.OK,
      );

    } catch (error) {
      next(error);
    }
  }
}
