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
import expenseTracker from '@presentation/http/routes/expense-tracker/expense-tracker.routes';
import notificationRoutes from '@presentation/http/routes/notification/notification.routes';
import type { Application } from "express";
import { AdminAuthMiddleware } from "@presentation/express/middlewares/admin-auth.middleware";
import { ADMIN_TYPES } from "@infrastructure/inversify_di/features/admin/admin.types";
import marketNewsRoutes from "@presentation/http/routes/market-news/markets-news.routes"
import chatbotRoutes from '@presentation/http/routes/ai-chatbot/ai-chatbot.route';
import adminStockRoutes from '@presentation/http/routes/stocks/admin-stock-management.routes';
import userStockRoutes from '@presentation/http/routes/stocks/user-stock.routes';

export const RegisterRoutes = (app: Application) => {
  const authMiddleware = container.get<AuthMiddleware>(AUTH_TYPES.AuthMiddleware);
  const authAdminMiddleware = container.get<AdminAuthMiddleware>(ADMIN_TYPES.AdminAuthMiddleware);

  app.use("/api/auth", authRoute);
  app.use("/api/admin/authentication", adminAuthRoute);

  app.use("/api/user/expense-tracker", (req, res, next) => authMiddleware.handle(req, res, next), expenseTracker);

  app.use("/api/user/mutual-funds/sip", (req, res, next) => authMiddleware.handle(req, res, next), mutualFundSipUserRoues);
  app.use("/api/user/mutual-funds", (req, res, next) => authMiddleware.handle(req, res, next), mutualFundUserRoues);
  app.use("/api/user/portfolio", (req, res, next) => authMiddleware.handle(req, res, next), userPortfoilo);
  app.use("/api/notifications", (req, res, next) => authMiddleware.handle(req, res, next), notificationRoutes);

  app.use("/api/user", (req, res, next) => authMiddleware.handle(req, res, next), userRoute);

  app.use('/api/bot', (req, res, next) => authMiddleware.handle(req, res, next), chatbotRoutes);

  app.use('/api/admin/mutual-funds', (req, res, next) => authAdminMiddleware.handle(req, res, next), mutualFundRoutes);
  app.use("/api/admin/sip-management", (req, res, next) => authAdminMiddleware.handle(req, res, next), adminSipRoutes);
  app.use('/api/payments', (req, res, next) => authMiddleware.handle(req, res, next), paymentRoutes);
  app.use("/api/admin", (req, res, next) => authAdminMiddleware.handle(req, res, next), adminRoutes);
  app.use("/api/market-news", (req, res, next) => authMiddleware.handle(req, res, next), marketNewsRoutes);
  app.use("/api/file-upload", fileUploadRoutes);

  app.use('/api/admin/stocks', (req, res, next) => authAdminMiddleware.handle(req, res, next), adminStockRoutes);
  app.use('/api/user/stocks', (req, res, next) => authMiddleware.handle(req, res, next), userStockRoutes);
}; 