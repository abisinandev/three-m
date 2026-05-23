import type { KycEntity } from "@domain/entities/user/kyc.entity";
import type { QueryOptions } from "mongoose";
import { IBaseRepository } from "../base-repository.interface";

export interface IKycRepository extends IBaseRepository<KycEntity> {
  findWithFilters(options: QueryOptions): Promise<KycEntity[]>;
  updateKycDoc(
    kydId: string,
    query: { isKycVerified: boolean; status: string; rejectionReason?: string },
  ): Promise<KycEntity | null>;
  getPendingKycCount(): Promise<number>;
}
