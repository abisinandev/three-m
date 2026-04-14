import { ContainerModule } from "inversify";
import { PAYMENT_TYPES } from "./payment.types";
import { PaymentController } from "@presentation/http/controllers/payment/payment.controller";
import { StripePaymentHandler } from "@shared/utils/payments/payment.handler";
import { WebhookController } from "@presentation/http/controllers/payment/webhook.controller";
import { ProcessStripePaymentUseCase } from "@application/use_cases/payment/process-payment.usecase";

export const PaymentModule = new ContainerModule(({ bind }) => {
    // Controller
    bind<PaymentController>(PAYMENT_TYPES.PaymentController).to(PaymentController);
    bind<WebhookController>(PAYMENT_TYPES.WebhookController).to(WebhookController);

    // Handler
    bind<StripePaymentHandler>(PAYMENT_TYPES.StripePaymentHandler).to(StripePaymentHandler);
    bind<ProcessStripePaymentUseCase>(PAYMENT_TYPES.ProcessStripePaymentUseCase).to(ProcessStripePaymentUseCase)
});
