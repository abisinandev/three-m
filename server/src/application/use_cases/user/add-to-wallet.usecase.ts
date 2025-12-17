import { IBlockRepository } from "@application/interfaces/repositories/block-repository.interface";
import { ITransactionRepository } from "@application/interfaces/repositories/transaction-repository.interface";
import { BlockEntity } from "@domain/entities/block.entity";
import { TransactionEntity } from "@domain/entities/transaction.entity";
import { TransactionTypes } from "@domain/enum/wallet/transaction-types.enum";
import { USER_TYPES } from "@infrastructure/inversify_di/types/user/user.types";
import { inject, injectable } from "inversify";
import { IAddToWalletUseCase } from "../interfaces/user/add-to-wallet-usecase.interface";
import { AddToWalletDTO } from "@application/dto/user/add-to-wallet.dto";
import { IUserRepository } from "@application/interfaces/repositories/user-repository.interface";
import { NotFoundError } from "@presentation/express/utils/error-handling";
import { ErrorMessage } from "@domain/enum/express/messages/error.message";

@injectable()
export class AddToWalletUseCase implements IAddToWalletUseCase {
    constructor(
        @inject(USER_TYPES.TransactionRepository) private readonly _transactionRepository: ITransactionRepository,
        @inject(USER_TYPES.BlockRepository) private readonly _blockRepository: IBlockRepository,
        @inject(USER_TYPES.UserRepository) private readonly _userRepository: IUserRepository,
    ) { }

    async execute(data: AddToWalletDTO): Promise<any> {

        const user = await this._userRepository.findById(data.userId);

        if (!user) throw new NotFoundError(ErrorMessage.USER_NOT_FOUND);

        const transaction = TransactionEntity.create({
            amount: data.amount,
            userId: data.userId,
            currency: data.currency,
            type: TransactionTypes.ADD_TO_WALLET,
            referenceType: data.referenceType,
            status: data.status,
            receipt_url:data.receipt_url,
        });

        await this._transactionRepository.create(transaction);

        const lastBlock = await this._blockRepository.getLastBlock();

        const block = BlockEntity.create({
            index: lastBlock ? Number(lastBlock?.index) + 1 : 0,
            prevHash: lastBlock?.prevHash as string,
            txHash: transaction.txHash
        });

        await this._blockRepository.create(block)
    }
}