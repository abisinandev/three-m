import { AdminAuthDTO } from "@application/dto/admin/admin-auth.dto";
import { ResendOtpDTO } from "@application/dto/auth/resend-otp.dto";
import { VerifyOtpDTO } from "@application/dto/auth/verify-otp.dto";
import { container } from "@infrastructure/inversify_di/container";
import { ADMIN_TYPES } from "@infrastructure/inversify_di/features/admin/admin.types";
import { validateDTO } from "@presentation/express/middlewares/validation-dto.middlewares";
import { AUTH_ROUTES } from "@presentation/express/utils/constants/admin-routes.constants";
import type { AdminAuthController } from "@presentation/http/controllers/admin/admin-auth.controller";
import { Router } from "express";

const router = Router();

const authController = container.get<AdminAuthController>(
  ADMIN_TYPES.AdminAuthController,
);

router.post(AUTH_ROUTES.AUTH, validateDTO(AdminAuthDTO), authController.authentication.bind(authController));
router.post(AUTH_ROUTES.VERIFY_OTP, validateDTO(VerifyOtpDTO), authController.veirfyOtp.bind(authController));
router.post(AUTH_ROUTES.RESEND_OTP, validateDTO(ResendOtpDTO), authController.resendOtp.bind(authController));
router.post(AUTH_ROUTES.REFRESH_API, authController.refresh.bind(authController));


export default router;
