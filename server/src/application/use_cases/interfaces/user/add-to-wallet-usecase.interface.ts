import { AddToWalletDTO } from "@application/dto/user/add-to-wallet.dto";

export interface IAddToWalletUseCase {
    execute(data: AddToWalletDTO): Promise<void>;
}