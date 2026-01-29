import { container } from "@infrastructure/inversify_di/container";
import { ADMIN_TYPES } from "@infrastructure/inversify_di/features/admin/admin.types";
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

router.get(PROTECTED_ROUTES.PROILE, adminController.getProfile.bind(adminController));
router.post(PROTECTED_ROUTES.LOGOUT, authController.logout.bind(authController));

router.get(PROTECTED_ROUTES.FETCH_USER, adminUserController.fetchUserDetails.bind(adminUserController));
router.patch(PROTECTED_ROUTES.BLOCK_USER, adminUserController.blockUser.bind(adminUserController));
router.patch(PROTECTED_ROUTES.UNBLOCK_USER, adminUserController.unblockUser.bind(adminUserController));

router.get(PROTECTED_ROUTES.FETCH_KYC_DATAS, adminKycController.fetchAllKycDocs.bind(adminKycController));
router.get(PROTECTED_ROUTES.VIEW_KYC_DETAILS, adminKycController.viewKycDetails.bind(adminKycController));
router.patch(PROTECTED_ROUTES.VERIFY_KYC, adminKycController.verifyKyc.bind(adminKycController));
router.patch(PROTECTED_ROUTES.REJECT_KYC, adminKycController.rejectKyc.bind(adminKycController));

router.get(PROTECTED_ROUTES.FETCH_TRANSACTIONS, adminTransactionsController.getTransactions.bind(adminTransactionsController));
router.patch(PROTECTED_ROUTES.VERIFY_TRANSACTIONS, adminTransactionsController.verifyTransaction.bind(adminTransactionsController));

export default router;
