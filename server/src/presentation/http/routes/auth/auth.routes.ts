import { Verify2faDTO } from "@application/dto/auth/2fa-verify-dto";
import { CreateUserDTO } from "@application/dto/auth/create-user.dto";
import { ForgotPasswordDTO } from "@application/dto/auth/forgot-password";
import { ResendOtpDTO } from "@application/dto/auth/resend-otp.dto";
import { ResetPasswordDTO } from "@application/dto/auth/reset-password";
import { UserLoginDTO } from "@application/dto/auth/user-login.dto";
import { VerifyOtpDTO } from "@application/dto/auth/verify-otp.dto";
import { container } from "@infrastructure/inversify_di/container";
import { AUTH_TYPES } from "@infrastructure/inversify_di/features/auth/auth.types";
import { validateDTO } from "@presentation/express/middlewares/validation-dto.middlewares";
import { AuthRoutes } from "@shared/routes/auth.routes";
import type { AuthController } from "@presentation/http/controllers/auth/auth.controller";
import { Router } from "express";

const router = Router();

const authController = container.get<AuthController>(AUTH_TYPES.AuthController);

router.post(AuthRoutes.SIGNUP, validateDTO(CreateUserDTO), authController.signup.bind(authController));
router.post(AuthRoutes.LOGIN, validateDTO(UserLoginDTO), authController.login.bind(authController));
router.post(AuthRoutes.TWO_FA_VERIFY, validateDTO(Verify2faDTO), authController.verifyTwoFactor.bind(authController));
router.post(AuthRoutes.REFRESH, authController.refresh.bind(authController));
router.post(AuthRoutes.VERIFY_OTP, validateDTO(VerifyOtpDTO), authController.verifySignupOtp.bind(authController));
router.post(AuthRoutes.RESEND_OTP, validateDTO(ResendOtpDTO), authController.resendOtp.bind(authController));
router.post(AuthRoutes.FORGOT_PASSWORD, validateDTO(ForgotPasswordDTO), authController.forgotPassword.bind(authController));
router.post(AuthRoutes.FORGOT_PASS_VERIFY_OTP, validateDTO(VerifyOtpDTO), authController.forgotPasswordVeirfyOtp.bind(authController));
router.post(AuthRoutes.FORGOT_PASS_RESENT_OTP, validateDTO(ResendOtpDTO), authController.forgotPasswordResendOtp.bind(authController));
router.post(AuthRoutes.RESET_PASSWORD, validateDTO(ResetPasswordDTO), authController.resetPassword.bind(authController));

router.post(AuthRoutes.GOOGLE_AUTH, authController.googleAuth.bind(authController));
export default router;
