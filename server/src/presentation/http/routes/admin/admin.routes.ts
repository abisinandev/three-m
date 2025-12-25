import { container } from "@infrastructure/inversify_di/inversify.di";
import { ADMIN_TYPES } from "@infrastructure/inversify_di/types/admin/admin.types";
import { AdminAuthMiddleware } from "@presentation/express/middlewares/admin-auth.middleware";
import { PROTECTED_ROUTES } from "@presentation/express/utils/constants/admin-routes.constants";
import type { AdminController } from "@presentation/http/controllers/admin/admin.controller";
import { AdminAuthController } from "@presentation/http/controllers/admin/admin-auth.controller";
import type { AdminKycController } from "@presentation/http/controllers/admin/admin-kyc.controller";
import type { AdminUserController } from "@presentation/http/controllers/admin/admin-user.controller";
import { Router } from "express";
import { AdminTransactionsController } from "@presentation/http/controllers/admin/admin-transactions.controller";

const router = Router();

const adminController = container.get<AdminController>(ADMIN_TYPES.AdminController);
const authController = container.get<AdminAuthController>(ADMIN_TYPES.AdminAuthController);
const adminUserController = container.get<AdminUserController>(ADMIN_TYPES.AdminUserController);
const adminKycController = container.get<AdminKycController>(ADMIN_TYPES.AdminKycController);
const adminTransactionsController = container.get<AdminTransactionsController>(ADMIN_TYPES.AdminTransactionsController);

router.get(PROTECTED_ROUTES.PROILE, AdminAuthMiddleware, adminController.getProfile.bind(adminController));
router.post(PROTECTED_ROUTES.LOGOUT, AdminAuthMiddleware, authController.logout.bind(authController));

router.get(PROTECTED_ROUTES.FETCH_USER, AdminAuthMiddleware, adminUserController.fetchUserDetails.bind(adminUserController));
router.patch(PROTECTED_ROUTES.BLOCK_USER, AdminAuthMiddleware, adminUserController.blockUser.bind(adminUserController));
router.patch(PROTECTED_ROUTES.UNBLOCK_USER, AdminAuthMiddleware, adminUserController.unblockUser.bind(adminUserController));

router.get(PROTECTED_ROUTES.FETCH_KYC_DATAS, AdminAuthMiddleware, adminKycController.fetchAllKycDocs.bind(adminKycController));
router.get(PROTECTED_ROUTES.VIEW_KYC_DETAILS, AdminAuthMiddleware, adminKycController.viewKycDetails.bind(adminKycController));
router.patch(PROTECTED_ROUTES.VERIFY_KYC, AdminAuthMiddleware, adminKycController.verifyKyc.bind(adminKycController));
router.patch(PROTECTED_ROUTES.REJECT_KYC, AdminAuthMiddleware, adminKycController.rejectKyc.bind(adminKycController));

router.get(PROTECTED_ROUTES.FETCH_TRANSACTIONS, AdminAuthMiddleware, adminTransactionsController.getTransactions.bind(adminTransactionsController));
router.patch(PROTECTED_ROUTES.VERIFY_TRANSACTIONS, AdminAuthMiddleware, adminTransactionsController.verifyTransaction.bind(adminTransactionsController));

export default router;
