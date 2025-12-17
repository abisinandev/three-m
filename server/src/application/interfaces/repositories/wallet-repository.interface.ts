import { WalletEntity } from "@domain/entities/wallet.entity";
import { IBaseRepository } from "./base-repository.interface";

export interface IWalletRepository extends IBaseRepository<WalletEntity>{
    
}