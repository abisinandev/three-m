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
import ordersRoutes from '@presentation/http/routes/stocks/orders.routes';
import algoTradingRoute from "@presentation/http/routes/algo-trading/algo-trading.routes";
import adminAlgoTradingRoutes from '@presentation/http/routes/admin/admin-algo-trading.routes';
import adminSubscriptionsRoutes from '@presentation/http/routes/admin/admin-subscription-management.routes'
import userSubscriptionRoutes from '@presentation/http/routes/user/user-subscription.routes';
import userDashboardRoutes from '@presentation/http/routes/user/user-dashboard.routes';
import adminDashboardRoutes from '@presentation/http/routes/admin/admin-dashboard.routes';
import { BaseRoutes } from "@shared/routes";

export const RegisterRoutes = (app: Application) => {
  const authMiddleware = container.get<AuthMiddleware>(AUTH_TYPES.AuthMiddleware);
  const authAdminMiddleware = container.get<AdminAuthMiddleware>(ADMIN_TYPES.AdminAuthMiddleware);

  app.use(BaseRoutes.AUTH, authRoute);
  app.use(BaseRoutes.ADMIN_AUTH, adminAuthRoute);

  app.use(BaseRoutes.USER_EXPENSE_TRACKER, (req, res, next) => authMiddleware.handle(req, res, next), expenseTracker);

  app.use(BaseRoutes.USER_SIP, (req, res, next) => authMiddleware.handle(req, res, next), mutualFundSipUserRoues);
  app.use(BaseRoutes.USER_MUTUAL_FUNDS, (req, res, next) => authMiddleware.handle(req, res, next), mutualFundUserRoues);
  app.use(BaseRoutes.USER_PORTFOLIO, (req, res, next) => authMiddleware.handle(req, res, next), userPortfoilo);
  app.use(BaseRoutes.NOTIFICATIONS, (req, res, next) => authMiddleware.handle(req, res, next), notificationRoutes);

  app.use(BaseRoutes.USER_DASHBOARD, (req, res, next) => authMiddleware.handle(req, res, next), userDashboardRoutes);

  app.use(BaseRoutes.USER, (req, res, next) => authMiddleware.handle(req, res, next), userRoute);
  app.use(BaseRoutes.USER_SUBSCRIPTIONS, (req, res, next) => authMiddleware.handle(req, res, next), userSubscriptionRoutes);

  app.use(BaseRoutes.BOT, (req, res, next) => authMiddleware.handle(req, res, next), chatbotRoutes);

  app.use(BaseRoutes.ADMIN_MUTUAL_FUNDS, (req, res, next) => authAdminMiddleware.handle(req, res, next), mutualFundRoutes);
  app.use(BaseRoutes.ADMIN_SIP, (req, res, next) => authAdminMiddleware.handle(req, res, next), adminSipRoutes);
  app.use(BaseRoutes.PAYMENTS, (req, res, next) => authMiddleware.handle(req, res, next), paymentRoutes);
  app.use(BaseRoutes.ADMIN_DASHBOARD, (req, res, next) => authAdminMiddleware.handle(req, res, next), adminDashboardRoutes);
  app.use(BaseRoutes.ADMIN, (req, res, next) => authAdminMiddleware.handle(req, res, next), adminRoutes);
  app.use(BaseRoutes.MARKET_NEWS, (req, res, next) => authMiddleware.handle(req, res, next), marketNewsRoutes);
  app.use(BaseRoutes.FILE_UPLOAD, fileUploadRoutes);

  app.use(BaseRoutes.ADMIN_STOCKS, (req, res, next) => authAdminMiddleware.handle(req, res, next), adminStockRoutes);
  app.use(BaseRoutes.USER_STOCKS, (req, res, next) => authMiddleware.handle(req, res, next), userStockRoutes);
  app.use(BaseRoutes.USER_STOCK_ORDER, (req, res, next) => authMiddleware.handle(req, res, next), ordersRoutes);
  app.use(BaseRoutes.ALGO_TRADING, (req, res, next) => authMiddleware.handle(req, res, next), algoTradingRoute);


  app.use(BaseRoutes.ADMIN_ALGO_TRADING, (req, res, next) => authAdminMiddleware.handle(req, res, next), adminAlgoTradingRoutes);
  app.use(BaseRoutes.ADMIN_SUBSCRIPTIONS, (req, res, next) => authAdminMiddleware.handle(req, res, next), adminSubscriptionsRoutes)
};