import { VerifyOtpDTO } from "@application/dto/auth/verify-otp.dto";
import { ChangeEmailDTO } from "@application/dto/user/change-email.dto";
import { ChangePasswordDTO } from "@application/dto/user/change-password.dto";
import { EditProfileDto } from "@application/dto/user/edit-profile.dto";
import { KycSubmitDTO } from "@application/dto/user/kyc-submit.dto";
import { UploadProfileImageDTO } from "@application/dto/user/upload-profile-image.dto";
import { container } from "@infrastructure/inversify_di/container";
import { USER_TYPES } from "@infrastructure/inversify_di/features/user/user.types";
import { validateDTO } from "@presentation/express/middlewares/validation-dto.middlewares";
import { UserRoutes } from "@shared/routes/user.routes";
import type { UserController } from "@presentation/http/controllers/user/user.controller";
import { WalletController } from "@presentation/http/controllers/wallet/wallet.controller";
import { UserStocksController } from "@presentation/http/controllers/user/user-stocks.controller";
import { Router } from "express";

const router = Router();

const userController = container.get<UserController>(USER_TYPES.UserController);
const walletController = container.get<WalletController>(USER_TYPES.WalletController);
const userStocksController = container.get<UserStocksController>(USER_TYPES.UserStocksController);

router.get(UserRoutes.PROFILE, userController.getProfile.bind(userController));
router.post(UserRoutes.CHANGE_PASSWORD, validateDTO(ChangePasswordDTO), userController.ChangePassword.bind(userController));
router.post(UserRoutes.KYC_SUBMIT, validateDTO(KycSubmitDTO), userController.kycSubmit.bind(userController));
router.patch(UserRoutes.PROFILE_UPDATE, validateDTO(EditProfileDto), userController.editProfile.bind(userController));
router.post(UserRoutes.EMAIL_UPDATE_OTP_SEND, validateDTO(ChangeEmailDTO), userController.changeEmailSendOtp.bind(userController));
router.post(UserRoutes.EMAIL_UPDATE_VERIFY, validateDTO(VerifyOtpDTO), userController.changeEmailVerifyOtp.bind(userController));
router.patch(UserRoutes.UPLOAD_PROFILE_IMAGE, validateDTO(UploadProfileImageDTO), userController.uploadProfile.bind(userController));
router.get(UserRoutes.WALLET, walletController.getWallet.bind(walletController));
router.post(UserRoutes.LOGOUT, userController.logout.bind(userController));
router.get(UserRoutes.STOCKS, userStocksController.getStocks.bind(userStocksController));

export default router;
