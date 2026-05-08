import { inject, injectable } from "inversify";
import { IPaymentPurposeHandler } from "@application/interfaces/services/payment/payment-purpose-handler.interface";
import { PaymentDataDTO } from "@application/dto/user/stripe-payment-dto";
import { IUpgradePremiumUseCase } from "@application/use_cases/user/subscription/interfaces/upgrade-premium-usecase.interface";
import { SUBSCRIPTION_TYPES } from "@infrastructure/inversify_di/features/subscription/subscription.types";
import { TransactionReferenceType } from "@domain/enum/wallet/transaction-reference-type";
import { TransactionTypes } from "@domain/enum/wallet/transaction-types.enum";
import { mapStripeStatusToTransactionStatus } from "@shared/utils/payments/stripe-payment.utils";

@injectable()
export class SubscriptionPaymentHandler implements IPaymentPurposeHandler {
    public readonly purpose = "SUBSCRIPTION";

    constructor(
        @inject(SUBSCRIPTION_TYPES.UpgradePremiumUseCase) private readonly _upgradePremium: IUpgradePremiumUseCase
    ) {}

    async handle(payment: PaymentDataDTO): Promise<void> {
        const mappedStatus = mapStripeStatusToTransactionStatus(payment.status);
        
        await this._upgradePremium.execute({
            userId: payment.userId,
            amount: payment.amount,
            paymentIntentId: payment.paymentIntentId,
            currency: payment.currency,
            receipt_url: "",
            referenceType: TransactionReferenceType.STRIPE,
            status: mappedStatus,
            type: TransactionTypes.SUBSCRIPTION,
        });
    }
}
