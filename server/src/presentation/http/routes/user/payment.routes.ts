import { container } from "@infrastructure/inversify_di/container";
import { USER_TYPES } from "@infrastructure/inversify_di/features/user/user.types";
import { PaymentController } from "@presentation/http/controllers/payment/payment.controller";
import { UserPaymentRoutes } from "@shared/routes/user.routes";
import { Router } from "express";

const router = Router();

const paymentController = container.get<PaymentController>(USER_TYPES.PaymentController);

// router.post('/create-intent', paymentController.createPaymentIntent.bind(paymentController));
router.post(
    UserPaymentRoutes.CREATE_CHECKOUT_SESSION,
    paymentController.createCheckoutSession.bind(paymentController)
);
export default router;