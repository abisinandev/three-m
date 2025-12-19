import { WalletResponseDTO } from "@application/dto/user/wallet-response.dto";

export interface IUserWalletUseCase {
    execute(userId: string): Promise<WalletResponseDTO>;
}