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

    async createTransaction(entity: TransactionEntity, session: ClientSession): Promise<TransactionEntity> {
        const persistenceData = this.mapper.toPersistance(entity);
        const createdDoc = await this.model.create([persistenceData], { session });
        return this.mapper.toDomain(createdDoc[0]);
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
        await this.model.findByIdAndUpdate(
            id, {
            $set: {
                status,
            },
        },
            { session },
        );
    }

    async findByPaymentId(paymentIntentId: string, session: ClientSession): Promise<TransactionEntity | null> {
        const doc = await this.model.findOne(
            { paymentIntentId },
            null,
            { session }
        );
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
        const successfulTransactions = await this.model.countDocuments({ status: TransactionStatus.SUCCESSFUL });
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
        const doc = await this.model.aggregate([{ $match: { status: TransactionStatus.SUCCESSFUL } },
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

    async getWeeklyCashFlow(): Promise<{ week: string; deposits: number; withdrawals: number }[]> {
        const result = await this.model.aggregate([
            {
                $match: {
                    status: TransactionStatus.SUCCESSFUL,
                    createdAt: { $gte: new Date(new Date().setDate(new Date().getDate() - 28)) }
                }
            },
            {
                $group: {
                    _id: { $week: "$createdAt" },
                    deposits: {
                        $sum: {
                            $cond: [{ $eq: ["$type", "DEPOSIT"] }, "$amount", 0]
                        }
                    },
                    withdrawals: {
                        $sum: {
                            $cond: [{ $eq: ["$type", "WITHDRAWAL"] }, "$amount", 0]
                        }
                    }
                }
            },
            { $sort: { "_id": 1 } as Record<string, 1 | -1> }
        ]);
        return result.map((r, i) => ({ week: `Week ${i + 1}`, deposits: r.deposits, withdrawals: r.withdrawals }));
    }

    async getRecentTransactions(limit: number): Promise<TransactionEntity[]> {
        const docs = await this.model.find().sort({ createdAt: -1 }).limit(limit).exec();
        return docs.map(doc => this.mapper.toDomain(doc));
    }

    async getTotalMRR(): Promise<number> {
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const result = await this.model.aggregate([
            {
                $match: {
                    status: TransactionStatus.SUCCESSFUL,
                    type: "SUBSCRIPTION",
                    createdAt: { $gte: startOfMonth }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: "$amount" }
                }
            }
        ]);
        return result.length > 0 ? result[0].total : 0;
    }
} 