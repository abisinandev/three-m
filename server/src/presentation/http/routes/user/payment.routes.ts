import { container } from "@infrastructure/inversify_di/container";
import { PAYMENT_TYPES } from "@infrastructure/inversify_di/features/payment/payment.types";
import { PaymentController } from "@presentation/http/controllers/payment/payment.controller";
import { UserPaymentRoutes } from "@shared/routes/user.routes";
import { Router } from "express";

const router = Router();

const controller = container.get<PaymentController>(PAYMENT_TYPES.PaymentController);

// router.post('/create-intent', paymentController.createPaymentIntent.bind(paymentController));
router.post(
    UserPaymentRoutes.CREATE_CHECKOUT_SESSION,
    controller.createCheckoutSession.bind(controller)
);

router.post(UserPaymentRoutes.VERIFY, controller.verifyPayment.bind(controller));

export default router;