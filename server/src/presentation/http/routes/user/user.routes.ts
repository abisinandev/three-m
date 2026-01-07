import { VerifyOtpDTO } from "@application/dto/auth/verify-otp.dto";
import { ChangeEmailDTO } from "@application/dto/user/change-email.dto";
import { ChangePasswordDTO } from "@application/dto/user/change-password.dto";
import { EditProfileDto } from "@application/dto/user/edit-profile.dto";
import { KycSubmitDTO } from "@application/dto/user/kyc-submit.dto";
import { UploadProfileImageDTO } from "@application/dto/user/upload-profile-image.dto";
import { container } from "@infrastructure/inversify_di/inversify.di";
import { USER_TYPES } from "@infrastructure/inversify_di/types/user/user.types";
import { validateDTO } from "@presentation/express/middlewares/validation-dto.middlewares";
import { Routes } from "@presentation/express/utils/constants/user-routes.constants";
import type { UserController } from "@presentation/http/controllers/user/user.controller";
import { WalletController } from "@presentation/http/controllers/wallet/wallet.controller";
import { Router } from "express";

const router = Router();

const userController = container.get<UserController>(USER_TYPES.UserController);
const walletController = container.get<WalletController>(USER_TYPES.WalletController);

router.get(Routes.PROFILE, userController.getProfile.bind(userController));
router.post(Routes.CHANGE_PASSWORD, validateDTO(ChangePasswordDTO), userController.ChangePassword.bind(userController));
router.post(Routes.KYC_SUBMIT, validateDTO(KycSubmitDTO), userController.kycSubmit.bind(userController));
router.patch(Routes.PROFILE_UPDATE, validateDTO(EditProfileDto), userController.editProfile.bind(userController));
router.post(Routes.EMAIL_UPDATE_OTP_SEND, validateDTO(ChangeEmailDTO), userController.changeEmailSendOtp.bind(userController));
router.post(Routes.EMAIL_UPDATE_VERIFY, validateDTO(VerifyOtpDTO), userController.changeEmailVerifyOtp.bind(userController));
router.patch(Routes.UPLOAD_PROFILE_IMAGE, validateDTO(UploadProfileImageDTO), userController.uploadProfile.bind(userController));
router.get(Routes.WALLET, walletController.getWallet.bind(walletController));
router.post(Routes.LOGOUT, userController.logout.bind(userController));

export default router;
