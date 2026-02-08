import { AdminAuthDTO } from "@application/dto/admin/admin-auth.dto";
import { ResendOtpDTO } from "@application/dto/auth/resend-otp.dto";
import { VerifyOtpDTO } from "@application/dto/auth/verify-otp.dto";
import { container } from "@infrastructure/inversify_di/container";
import { ADMIN_TYPES } from "@infrastructure/inversify_di/features/admin/admin.types";
import { validateDTO } from "@presentation/express/middlewares/validation-dto.middlewares";
import { AdminAuthRoutes } from "@shared/routes/admin.routes";
import type { AdminAuthController } from "@presentation/http/controllers/admin/admin-auth.controller";
import { Router } from "express";

const router = Router();

const authController = container.get<AdminAuthController>(
  ADMIN_TYPES.AdminAuthController,
);

router.post(AdminAuthRoutes.AUTH, validateDTO(AdminAuthDTO), authController.authentication.bind(authController));
router.post(AdminAuthRoutes.VERIFY_OTP, validateDTO(VerifyOtpDTO), authController.veirfyOtp.bind(authController));
router.post(AdminAuthRoutes.RESEND_OTP, validateDTO(ResendOtpDTO), authController.resendOtp.bind(authController));
router.post(AdminAuthRoutes.REFRESH_API, authController.refresh.bind(authController));


export default router;
