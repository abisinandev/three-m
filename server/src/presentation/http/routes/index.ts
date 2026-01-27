import { container } from "@infrastructure/inversify_di/container";
import { AUTH_TYPES } from "@infrastructure/inversify_di/features/auth/auth.types";
import type { AuthMiddleware } from "@presentation/express/middlewares/auth.middleware";
import adminRoutes from "@presentation/http/routes/admin/admin.routes";
import adminAuthRoute from "@presentation/http/routes/admin/admin-auth.routes";
import adminSipRoutes from "@presentation/http/routes/admin/admin-sip.routes";
import authRoute from "@presentation/http/routes/auth/auth.routes";
import userRoute from "@presentation/http/routes/user/user.routes";
import paymentRoutes from "@presentation/http/routes/user/payment.routes";
import mutualFundRoutes from '@presentation/http/routes/admin/mutual-fund-admin.routes';
import fileUploadRoutes from '@presentation/http/routes/file-upload/file-upload.routes';
import mutualFundUserRoues from '@presentation/http/routes/user/mutual-fund-user.routes';
import mutualFundSipUserRoues from '@presentation/http/routes/user/mutual-fund-sip.routes';
import userPortfoilo from '@presentation/http/routes/portfolio/portfolio.routes';
import type { Application } from "express";
import { AdminAuthMiddleware } from "@presentation/express/middlewares/admin-auth.middleware";
import { ADMIN_TYPES } from "@infrastructure/inversify_di/features/admin/admin.types";

export const RegisterRoutes = (app: Application) => {
  const authMiddleware = container.get<AuthMiddleware>(AUTH_TYPES.AuthMiddleware);
  const authAdminMiddleware = container.get<AdminAuthMiddleware>(ADMIN_TYPES.AdminAuthMiddleware);

  app.use("/api/auth", authRoute);
  app.use("/api/admin/authentication", adminAuthRoute);
  app.use("/api/user", (req, res, next) => authMiddleware.handle(req, res, next), userRoute);
  app.use("/api/admin", (req, res, next) => authAdminMiddleware.handle(req, res, next), adminRoutes);
  app.use('/api/payments', (req, res, next) => authMiddleware.handle(req, res, next), paymentRoutes);
  app.use('/api/admin/mutual-funds', (req, res, next) => authAdminMiddleware.handle(req, res, next), mutualFundRoutes);
  app.use("/api/user/mutual-funds/sip", (req, res, next) => authMiddleware.handle(req, res, next), mutualFundSipUserRoues)
  app.use("/api/user/mutual-funds", (req, res, next) => authMiddleware.handle(req, res, next), mutualFundUserRoues)
  app.use("/api/file-upload", fileUploadRoutes);
  app.use("/api/user/portfolio", (req, res, next) => authMiddleware.handle(req, res, next), userPortfoilo);
  app.use("/api/admin/sip-management", (req, res, next) => authAdminMiddleware.handle(req, res, next), adminSipRoutes);
};