import { KycMapper } from "@infrastructure/mappers/user/kyc.mapper";
import { injectable } from "inversify";
import type { QueryOptions } from "mongoose";
import { BaseRepository } from "../base.repository";
import { IKycRepository } from "@application/interfaces/repositories/user/kyc-repository.interface";
import { KycEntity } from "@domain/entities/user/kyc.entity";
import { KycDocument, KycModel } from "@infrastructure/databases/mongo_db/models/schemas/user/kyc.schema";

@injectable()
export class KycRepository extends BaseRepository<KycEntity, KycDocument> implements IKycRepository {
  
  constructor() {
    super(KycModel, KycMapper);
  }

  async findWithFilters(options: QueryOptions): Promise<KycEntity[]> {
    const {
      page = 1,
      limit = 10,
      status,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = options;

    type KycFilter = {
      status?: string;
    };

    const skip = (page - 1) * limit;

    const finalFilter: KycFilter = {};
    if (status) {
      finalFilter.status = status.length ? status : "";
    }

    const sort: Record<string, 1 | -1> = {
      [sortBy]: sortOrder === "asc" ? 1 : -1,
    };

    const docs = await this.model
      .find(finalFilter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .exec();

    return Promise.all(docs.map((doc) => this.mapper.toDomain(doc)));
  }

  async updateKycDoc(
    kydId: string,
    query: { isKycVerified: boolean; status: string; rejectionReason?: string },
  ): Promise<KycEntity | null> {
    return await this.model.findByIdAndUpdate(kydId, query, { new: true });
  }

  async getPendingKycCount(): Promise<number> {
    return this.model.countDocuments({ status: "pending" });
  }
}
