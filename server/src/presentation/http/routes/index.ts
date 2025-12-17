import { container } from "@infrastructure/inversify_di/inversify.di";
import { AUTH_TYPES } from "@infrastructure/inversify_di/types/auth/auth.types";
import type { AuthMiddleware } from "@presentation/express/middlewares/auth.middleware";
import adminRoutes from "@presentation/http/routes/admin/admin.routes";
import adminAuthRoute from "@presentation/http/routes/admin/admin-auth.routes";
import authRoute from "@presentation/http/routes/auth/auth.routes";
import userRoute from "@presentation/http/routes/user/user.routes";
import paymentRoutes from "@presentation/http/routes/user/payment.routes";
import type { Application } from "express";

export const RegisterRoutes = (app: Application) => {
  const authMiddleware = container.get<AuthMiddleware>(AUTH_TYPES.AuthMiddleware);

  app.use("/api/auth", authRoute);
  app.use("/api/admin/authentication", adminAuthRoute);
  app.use("/api/user", (req, res, next) => authMiddleware.handle(req, res, next), userRoute);
  app.use("/api/admin", adminRoutes);
  app.use('/api/payments', (req, res, next) => authMiddleware.handle(req, res, next), paymentRoutes);
};