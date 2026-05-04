export const PAYMENT_TYPES = {
    PaymentController: Symbol.for("PaymentController"),
    WebhookController: Symbol.for("WebhookController"),
    ProcessStripePaymentUseCase: Symbol.for("ProcessStripePaymentUseCase"),
    PaymentGateway: Symbol.for("PaymentGateway"),
    CreateCheckoutSessionUseCase: Symbol.for("CreateCheckoutSessionUseCase"),
    PaymentPurposeHandler: Symbol.for("PaymentPurposeHandler"),
    FulfillPaymentUseCase: Symbol.for("FulfillPaymentUseCase"),
};
