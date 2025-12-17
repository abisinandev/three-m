import { UserWalletDTO } from "@application/dto/user/user-wallet.dto";
import { WalletEntity } from "@domain/entities/wallet.entity";

// export const toEntity = (dto: UserWalletDTO): WalletEntity => {
//     return WalletEntity.create({
//         userId: dto.userId as string,
//         balance: dto.balance,
//         status: dto.status,
//         currency: dto.currency,
//     })
// }