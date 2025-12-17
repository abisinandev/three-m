import { UserWalletDTO } from "@application/dto/user/user-wallet.dto";

export interface IUserWalletUseCase {
    execute(userId: string): Promise<UserWalletDTO>;
}