import { PaymentDataDTO } from "@application/dto/user/stripe-payment-dto";
import { IPaymentPurposeHandler } from "@application/interfaces/services/payment/payment-purpose-handler.interface";
import { IAddToWalletUseCase } from "@application/use_cases/user/wallet/interfaces/add-to-wallet-usecase.interface";
import { TransactionReferenceType } from "@domain/enum/wallet/transaction-reference-type";
import { TransactionTypes } from "@domain/enum/wallet/transaction-types.enum";
import { USER_TYPES } from "@infrastructure/inversify_di/features/user/user.types";
import { mapStripeStatusToTransactionStatus } from "@shared/utils/payments/stripe-payment.utils";
import { inject, injectable } from "inversify";

@injectable()
export class AddToWalletHanlder implements IPaymentPurposeHandler {

    public readonly purpose = "TOPUP";

    constructor(
        @inject(USER_TYPES.AddToWalletUseCase) private readonly _addToWallet: IAddToWalletUseCase
    ) { }

    async handle(payment: PaymentDataDTO): Promise<void> {
        const mappedStatus = mapStripeStatusToTransactionStatus(payment.status);

        await this._addToWallet.execute({
            userId: payment.userId,
            amount: payment.amount,
            paymentIntentId: payment.paymentIntentId,
            currency: payment.currency,
            receipt_url: "",
            referenceType: TransactionReferenceType.STRIPE,
            status: mappedStatus,
            type: TransactionTypes.ADD_TO_WALLET,
        });
    }
}