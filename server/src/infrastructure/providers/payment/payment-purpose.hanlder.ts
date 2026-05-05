import { PaymentDataDTO } from "@application/dto/user/stripe-payment-dto";
import { IPaymentPurposeHandler } from "@application/interfaces/services/payment/payment-purpose-handler.interface";
import { IAddToWalletUseCase } from "@application/use_cases/user/wallet/interfaces/add-to-wallet-usecase.interface";
import { USER_TYPES } from "@infrastructure/inversify_di/features/user/user.types";
import { inject, injectable } from "inversify";

@injectable()
export class TopupHandler implements IPaymentPurposeHandler {
    constructor(
        @inject(USER_TYPES.AddToWalletUseCase) private readonly addToWallet: IAddToWalletUseCase
    ) { }

    supports(purpose: string): boolean {
        return purpose === "TOPUP";
    }

    async handle(data: PaymentDataDTO): Promise<void> {
        await this.addToWallet.execute({
            ...data,
            type: TransactionTypes.ADD_TO_WALLET,
            
        });
    }
}