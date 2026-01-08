import { TransactionResponseDTO } from "@application/dto/user/transaction-response.dto";
import { UserWalletDTO } from "@application/dto/user/user-wallet.dto";
import { WalletResponseDTO } from "@application/dto/user/wallet-response.dto";
import { WalletEntity } from "@domain/entities/user/wallet.entity";
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

export const toWalletResponse = (wallet: WalletEntity, transactions: TransactionResponseDTO[]): WalletResponseDTO => {
    return {
        id: wallet.id as string,
        userId: wallet.userId,
        balance: wallet.balance,
        currency: wallet.currency,
        status: wallet.status,
        createdAt: wallet.createdAt?.toDateString() ?? "",
        updatedAt: wallet.updatedAt?.toDateString() ?? "",
        transactions,
    }
}