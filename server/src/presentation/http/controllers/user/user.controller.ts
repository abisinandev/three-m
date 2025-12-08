import type { IChangeEmailSendOtpUseCase } from "@application/use_cases/interfaces/user/change-email-usecase.interface";
import type { IChangeEmailVerifyOtpUseCase } from "@application/use_cases/interfaces/user/change-email-verify-usecase.interface";
import type { IChangePasswordUseCase } from "@application/use_cases/interfaces/user/change-password.usecase.interface";
import type { IEditProfileUseCase } from "@application/use_cases/interfaces/user/edit-profile-usecase.interface";
import type { IKycSubmitUseCase } from "@application/use_cases/interfaces/user/kyc-submit-usecase.interface";
import { IProfileImageUploadUseCase } from "@application/use_cases/interfaces/user/profile-image-upload-usecase.interface";
import type { ISignatureUploadUseCase } from "@application/use_cases/interfaces/user/signature-upload-usecase.interface";
import type { IUserLogoutUseCase } from "@application/use_cases/interfaces/user/user-logout-usecase.interface";
import type { IUserProfileInterface } from "@application/use_cases/interfaces/user/user-profile-usecase.interface";
import { SuccessMessage } from "@domain/enum/express/messages/success.message";
import { HttpStatus } from "@domain/enum/express/status-code";
import { USER_TYPES } from "@infrastructure/inversify_di/types/user/user.types";
import { logger } from "@infrastructure/providers/logger/winston.logger";
import type { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";

@injectable()
export class UserController {
  constructor(
    @inject(USER_TYPES.GetUserProfileUseCase) private readonly _getUserProfile: IUserProfileInterface,
    @inject(USER_TYPES.ChangePasswordUseCase) private readonly _changePassword: IChangePasswordUseCase,
    @inject(USER_TYPES.LogoutUseCase) private readonly _logoutUseCase: IUserLogoutUseCase,
    @inject(USER_TYPES.SignatureUploadUseCase) private readonly _signUploadUseCase: ISignatureUploadUseCase,
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
      res.status(HttpStatus.OK).json({
        success: true,
        message: SuccessMessage.DATA_FETCHED,
        data: result,
      });
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
      return res.status(HttpStatus.OK).json({
        success: true,
        message: SuccessMessage.PASSWORD_CHANGED,
      });
    } catch (error) {
      next(error);
    }
  }

  async signUpload(req: Request, res: Response, next: NextFunction) {
    try {
      const folder = req.query.folder as string;
      const userId = req.query.userId as string;
      const result = await this._signUploadUseCase.execute({
        folder: folder as string,
        userId: userId as string,
      });

      logger.info(`result : ${result}`);
      return res.status(HttpStatus.OK).json({
        success: true,
        message: SuccessMessage.UPLOAD_SUCCESS,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async kycSubmit(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = { ...req.body };
      logger.info(`kyc data: ${dto}`);
      await this._kycSubmitUseCase.execute(dto);
      return res.json({ success: true });
    } catch (error) {
      next(error);
    }
  }

  async editProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = { ...req.body };
      const userId = req.user?.id;

      await this._editProfileUseCase.execute(userId as string, dto);
      return res.status(HttpStatus.OK).json({
        success: true,
        message: SuccessMessage.PROFILE_UPDATION_DONE,
      })
    } catch (error) {
      next(error)
    }
  }

  async uploadProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = { ...req.body };
      await this._profileImageUploadUseCase.execute(dto);
      return res.status(HttpStatus.OK).json({
        success: true,
        message: SuccessMessage.PROFILE_IMAGE_ADDED
      })
    } catch (error) {
      next(error)
    }
  }

  async changeEmailSendOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = { ...req.body };
      const userId = req?.user?.id;

      await this._changeEmailSendOtp.execute(userId as string, dto);
      return res.status(HttpStatus.OK).json({
        success: true,
        message: SuccessMessage.EMAIL_UPDATION_OTP_SEND
      })
    } catch (error) {
      next(error)
    }
  }

  async changeEmailVerifyOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = { ...req.body };
      const userId = req?.user?.id;
      await this._changeEmailVerifyOtpUseCase.execute(userId as string, dto);

      return res.status(HttpStatus.OK).json({
        success: true,
        message: SuccessMessage.EMAIL_UPDATION_VERIFY_OTP
      })
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

      return res.status(HttpStatus.OK).json({
        success: true,
        message: SuccessMessage.LOGGED_OUT,
      });
    } catch (error) {
      next(error);
    }
  }
}
