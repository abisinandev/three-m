import { FetchWalletDTO } from "@application/dto/user/fetch-wallet.dto";
import { WalletResponseDTO } from "@application/dto/user/wallet-response.dto";
import { QueryOptions } from "mongoose";

export interface IUserWalletUseCase {
    execute(userId: string, query: QueryOptions): Promise<FetchWalletDTO<WalletResponseDTO>>;
}