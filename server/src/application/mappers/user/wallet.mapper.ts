import { UserWalletDTO } from "@application/dto/user/user-wallet.dto";
import { WalletResponseDTO } from "@application/dto/user/wallet-response.dto";
import { TransactionEntity } from "@domain/entities/transaction.entity";
import { WalletEntity } from "@domain/entities/wallet.entity";
import { CurrencyTypes } from "@domain/enum/users/currency-enum";
import { WalletStatus } from "@domain/enum/wallet/wallet-status.enum";

export const toEntity = (dto: UserWalletDTO): WalletEntity => {
    return WalletEntity.create({
        userId: dto.userId as string,
        balance: 0,
        status: WalletStatus.ACTIVE,
        currency: CurrencyTypes.INR,
    })
}

export const toWalletResponse = (wallet: WalletEntity,transactions:TransactionEntity[]): WalletResponseDTO => {
    return {
        id: wallet.id as string,
        userId: wallet.userId,
        balance: wallet.balance,
        currency: wallet.currency,
        status: wallet.status,
        isVerified: wallet.isVerified,
        createdAt: wallet.createdAt?.toDateString() ?? "",
        updatedAt: wallet.updatedAt?.toDateString() ?? "",
        transactions,
    }
}