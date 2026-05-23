import { OrderSide } from "@domain/entities/stock/enum/order-side.enum";
import { StockEntity } from "@domain/entities/stock/stock.entity";
import { UserEntity } from "@domain/entities/user/user.entity";
import { WalletEntity } from "@domain/entities/user/wallet.entity";
import { ClientSession } from "mongoose";

export interface IStockValidationService {
    validateMarketOrder(
        userId: string,
        symbol: string,
        quantity: number,
        side: OrderSide,
        session?: ClientSession
    ): Promise<{ 
        user: UserEntity; 
        stock: StockEntity; 
        wallet: WalletEntity; 
        marketPrice: number;
    }>;
}
