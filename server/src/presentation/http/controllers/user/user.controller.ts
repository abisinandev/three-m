import type { IChangeEmailSendOtpUseCase } from "@application/use_cases/user/profile/interfaces/change-email-usecase.interface";
import type { IChangeEmailVerifyOtpUseCase } from "@application/use_cases/user/profile/interfaces/change-email-verify-usecase.interface";
import type { IChangePasswordUseCase } from "@application/use_cases/user/profile/interfaces/change-password.usecase.interface";
import type { IEditProfileUseCase } from "@application/use_cases/user/profile/interfaces/edit-profile-usecase.interface";
import type { IKycSubmitUseCase } from "@application/use_cases/user/profile/interfaces/kyc-submit-usecase.interface";
import { IProfileImageUploadUseCase } from "@application/use_cases/user/profile/interfaces/profile-image-upload-usecase.interface";
import type { IUserLogoutUseCase } from "@application/use_cases/auth/interfaces/user-logout-usecase.interface";
import type { IUserProfileInterface } from "@application/use_cases/user/profile/interfaces/user-profile-usecase.interface";
import { SuccessMessage } from "@domain/enum/express/messages/success.message";
import { HttpStatus } from "@domain/enum/express/status-code";
import { USER_TYPES } from "@infrastructure/inversify_di/features/user/user.types";
import { logger } from "@infrastructure/providers/logger/pino.logger";
import { ResponseHelper } from "@presentation/express/utils/response-handling/response.helper";
import type { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { SuccessMessages } from "@shared/constants/success.messages";

@injectable()
export class UserController {
  constructor(
    @inject(USER_TYPES.GetUserProfileUseCase) private readonly _getUserProfile: IUserProfileInterface,
    @inject(USER_TYPES.ChangePasswordUseCase) private readonly _changePassword: IChangePasswordUseCase,
    @inject(USER_TYPES.LogoutUseCase) private readonly _logoutUseCase: IUserLogoutUseCase,
    @inject(USER_TYPES.KycSubmitUseCase) private readonly _kycSubmitUseCase: IKycSubmitUseCase,
    @inject(USER_TYPES.EditProfileUseCase) private readonly _editProfileUseCase: IEditProfileUseCase,
    @inject(USER_TYPES.ChangeEmailSendOtpUseCase) private readonly _changeEmailSendOtp: IChangeEmailSendOtpUseCase,
    @inject(USER_TYPES.ChangeEmailVerifyOtpUseCase) private readonly _changeEmailVerifyOtpUseCase: IChangeEmailVerifyOtpUseCase,
    @inject(USER_TYPES.ProfileImageUploadUseCase) private readonly _profileImageUploadUseCase: IProfileImageUploadUseCase,
  ) { }

  async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req?.user;
      const result = await this._getUserProfile.execute({
        userId: user?.id as string,
      });

      return ResponseHelper.success(
        res,
        SuccessMessage.DATA_FETCHED,
        result,
        HttpStatus.OK,
      );
    } catch (error) {
      next(error);
    }
  }

  async ChangePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      logger.info(`jwt payload: , ${req.user}`);
      if (!userId) return;

      await this._changePassword.execute({
        userId,
        data: req.body,
      });

      return ResponseHelper.success(
        res,
        SuccessMessage.PASSWORD_CHANGED,
        null,
        HttpStatus.OK,
      );

    } catch (error) {
      next(error);
    }
  }

  async kycSubmit(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      const dto = { ...req.body };
      logger.info(`kyc data: ${dto}`);
      await this._kycSubmitUseCase.execute(userId as string, dto);
      return ResponseHelper.success(
        res,
        SuccessMessages.USER.KYC_SUBMITTED,
        null,
        HttpStatus.OK,
      );
    } catch (error) {
      next(error);
    }
  }

  async editProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = { ...req.body };
      const userId = req.user?.id;

      await this._editProfileUseCase.execute(userId as string, dto);
      return ResponseHelper.success(
        res,
        SuccessMessage.PROFILE_UPDATION_DONE,
        null,
        HttpStatus.OK,
      );
    } catch (error) {
      next(error)
    }
  }

  async uploadProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id as string;
      const dto = { ...req.body };
      await this._profileImageUploadUseCase.execute(userId, dto);
      return ResponseHelper.success(
        res,
        SuccessMessage.PROFILE_IMAGE_ADDED,
        null,
        HttpStatus.OK,
      );
    } catch (error) {
      next(error)
    }
  }

  async changeEmailSendOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = { ...req.body };
      const userId = req?.user?.id;

      await this._changeEmailSendOtp.execute(userId as string, dto);

      return ResponseHelper.success(
        res,
        SuccessMessage.EMAIL_UPDATION_OTP_SEND,
        null,
        HttpStatus.OK,
      );
    } catch (error) {
      next(error)
    }
  }

  async changeEmailVerifyOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = { ...req.body };
      const userId = req?.user?.id;
      await this._changeEmailVerifyOtpUseCase.execute(userId as string, dto);

      return ResponseHelper.success(
        res,
        SuccessMessage.EMAIL_UPDATION_VERIFY_OTP,
        null,
        HttpStatus.OK,
      );
    } catch (error) {
      next(error)
    }
  }

  logout(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (userId) {
        this._logoutUseCase.execute({ userId });
      }
      res.clearCookie("accessToken", { httpOnly: true, sameSite: "lax" });
      res.clearCookie("refreshToken", { httpOnly: true, sameSite: "lax" });

      return ResponseHelper.success(
        res,
        SuccessMessage.LOGGED_OUT,
        null,
        HttpStatus.OK,
      );
    } catch (error) {
      next(error);
    }
  }
}
