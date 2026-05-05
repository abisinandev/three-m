import { ContainerModule } from "inversify";
import { PAYMENT_TYPES } from "./payment.types";
import { PaymentController } from "@presentation/http/controllers/payment/payment.controller";
import { WebhookController } from "@presentation/http/controllers/payment/webhook.controller";
import { ProcessStripePaymentUseCase } from "@application/use_cases/payment/process-payment.usecase";
import { StripePaymentGateway } from "@infrastructure/providers/payment/stripe/stripe-payment-gateway";
import { IPaymentGateway } from "@application/interfaces/services/payment/payment-gateway";
import { ICreateCheckoutSessionUseCase } from "@application/use_cases/payment/interfaces/create-checkout-session-usecase.interface";
import { CreateCheckoutSessionUseCase } from "@application/use_cases/payment/create-checkout-session.usecase";
import { TopupPaymentHandler } from "@application/services/payment/handlers/topup-payment.handler";
import { SubscriptionPaymentHandler } from "@application/services/payment/handlers/subscription-payment.handler";
import { IPaymentPurposeHandler } from "@application/interfaces/services/payment/payment-purpose-handler.interface";
import { FulfillPaymentUseCase } from "@application/use_cases/payment/fulfill-payment.usecase";

export const PaymentModule = new ContainerModule(({ bind }) => {
    // Controller
    bind<PaymentController>(PAYMENT_TYPES.PaymentController).to(PaymentController);
    bind<WebhookController>(PAYMENT_TYPES.WebhookController).to(WebhookController);

    // Use Cases
    bind<ProcessStripePaymentUseCase>(PAYMENT_TYPES.ProcessStripePaymentUseCase).to(ProcessStripePaymentUseCase);
    bind<ICreateCheckoutSessionUseCase>(PAYMENT_TYPES.CreateCheckoutSessionUseCase).to(CreateCheckoutSessionUseCase);
    bind<FulfillPaymentUseCase>(PAYMENT_TYPES.FulfillPaymentUseCase).to(FulfillPaymentUseCase);

    bind<IPaymentGateway>(PAYMENT_TYPES.PaymentGateway).to(StripePaymentGateway);

    // Purpose Handlers
    bind<IPaymentPurposeHandler>(PAYMENT_TYPES.PaymentPurposeHandler).to(TopupPaymentHandler);
    bind<IPaymentPurposeHandler>(PAYMENT_TYPES.PaymentPurposeHandler).to(SubscriptionPaymentHandler);
});
