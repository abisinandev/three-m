import { TransactionMapper } from "@infrastructure/mappers/transaction/transaction.mapper";
import { BaseRepository } from "../base.repository";
import { TransactionEntity } from "@domain/entities/transaction/transaction.entity";
import { TransactionStatus } from "@domain/enum/wallet/transaction-status.enum";
import { ClientSession, QueryOptions } from "mongoose";
import { injectable } from "inversify";
import { ITransactionRepository } from "@application/interfaces/repositories/feature/transaction-repository.interface";
import { TransactionDocument, TransactionModel } from "@infrastructure/databases/mongo_db/models/schemas/transaction/transaction.schema";

@injectable()
export class TransactionRepository extends BaseRepository<TransactionEntity, TransactionDocument> implements ITransactionRepository {
    constructor() {
        super(TransactionModel, TransactionMapper)
    }

    async createTransaction(entity: TransactionEntity): Promise<TransactionEntity> {
        const persistenceData = this.mapper.toPersistance(entity);
        const createdDoc = await this.model.create(persistenceData);
        return this.mapper.toDomain(createdDoc);
    }


    async findTransaction(id: string, session?: ClientSession): Promise<TransactionEntity | null> {
        const query = this.model.findById(id);

        if (session) {
            query.session(session);
        }
        const doc = await query.exec();
        return doc ? this.mapper.toDomain(doc) : null;
    }

    async findUserVerifiedTransactions(userId: string): Promise<TransactionEntity[] | null> {
        const doc = await this.model.find({ userId, isVerified: true });
        return doc ? doc.map(doc => this.mapper.toDomain(doc)) : null;
    }

    async updateStatus(id: string, status: string, session: ClientSession): Promise<void> {
        const isVerified = (status === TransactionStatus.VERIFIED);
        await this.model.findByIdAndUpdate(
            id, {
            $set: {
                isVerified,
                status,
            },
        },
            { session },
        );
    }

    async findByPaymentId(paymentIntentId: string): Promise<TransactionEntity | null> {
        const doc = await this.model.findOne({ paymentIntentId })
        if (!doc) return null;
        return this.mapper.toDomain(doc);
    }

    async findUserTransactions(userId: string): Promise<TransactionEntity[] | null> {
        const docs = await this.model.find({ userId });
        if (!docs) return null;
        return docs.map(doc => this.mapper.toDomain(doc));
    }

    async findAllTransactions(options: QueryOptions): Promise<TransactionEntity[]> {
        const {
            page = 1,
            limit = 10,
            status,
            sortBy = "createdAt",
            sortOrder = "desc",
        } = options;

        const skip = (page - 1) * limit;

        const filter: Partial<Record<"status", TransactionStatus>> = {};

        if (status) {
            filter.status = status;
        }

        const sort: Record<string, 1 | -1> = {
            [sortBy]: sortOrder === "asc" ? 1 : -1,
        };

        const docs = await this.model
            .find(filter)
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .exec();

        return docs.map((doc) => this.mapper.toDomain(doc));
    }

    async findTotalTransactions(): Promise<{ totalTransactions: number; }> {
        const totalTransactions = await this.model.countDocuments();
        return { totalTransactions }
    }

    async findSuccessfulTransactions(): Promise<{ successfulTransactions: number; }> {
        const successfulTransactions = await this.model.countDocuments({ status: TransactionStatus.VERIFIED });
        return { successfulTransactions };
    }

    async findPendingTransactions(): Promise<{ pendingTansactions: number; }> {
        const pendingTansactions = await this.model.countDocuments({ status: TransactionStatus.PENDING });
        return { pendingTansactions };
    }

    async findFailedTransactions(): Promise<{ failedTransactions: number; }> {
        const failedTransactions = await this.model.countDocuments({ status: TransactionStatus.FAILED });
        return { failedTransactions };
    }

    async findTotalAmount(): Promise<{ totalAmount: number; }> {
        const doc = await this.model.aggregate([{ $match: { status: TransactionStatus.VERIFIED } },
        { $group: { _id: "", totalAmount: { $sum: "$amount" } } }
        ]);
        return {
            totalAmount: doc[0]?.totalAmount ?? 0
        };

    }

    async latestUserTransaction(userId: string): Promise<TransactionEntity | null> {
        const doc = await this.model
            .findOne({ userId })
            .sort({ createdAt: -1 });

        if (!doc) return null;

        return this.mapper.toDomain(doc);
    }
}