import { container } from "@infrastructure/inversify_di/inversify.di";
import { AUTH_TYPES } from "@infrastructure/inversify_di/types/auth/auth.types";
import type { AuthMiddleware } from "@presentation/express/middlewares/auth.middleware";
import adminRoutes from "@presentation/http/routes/admin/admin.routes";
import adminAuthRoute from "@presentation/http/routes/admin/admin-auth.routes";
import authRoute from "@presentation/http/routes/auth/auth.routes";
import userRoute from "@presentation/http/routes/user/user.routes";
import paymentRoutes from "@presentation/http/routes/user/payment.routes";
import mutualFundRoutes from '@presentation/http/routes/admin/mutual-fund-admin.routes';
import fileUploadRoutes from '@presentation/http/routes/file-upload/file-upload.routes';
import mutualFundUserRoues from '@presentation/http/routes/user/mutual-fund-user.routes';
import userPortfoilo from '@presentation/http/routes/portfolio/portfolio.routes';
import type { Application } from "express";

export const RegisterRoutes = (app: Application) => {
  const authMiddleware = container.get<AuthMiddleware>(AUTH_TYPES.AuthMiddleware);

  app.use("/api/auth", authRoute);
  app.use("/api/admin/authentication", adminAuthRoute);
  app.use("/api/user", (req, res, next) => authMiddleware.handle(req, res, next), userRoute);
  app.use("/api/admin", adminRoutes);
  app.use('/api/payments', (req, res, next) => authMiddleware.handle(req, res, next), paymentRoutes);
  app.use('/api/admin/mutual-funds', mutualFundRoutes);
  app.use("/api/user/mutual-funds", (req, res, next) => authMiddleware.handle(req, res, next), mutualFundUserRoues)
  app.use("/api/file-upload", fileUploadRoutes);
  app.use("/api/user/portfolio", (req, res, next) => authMiddleware.handle(req, res, next), userPortfoilo);
};