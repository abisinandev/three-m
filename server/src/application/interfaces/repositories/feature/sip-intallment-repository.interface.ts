import { SipInstallmentEntity } from "@domain/entities/mutual-fund/sip-intallment.entity";
import { IBaseRepository } from "../base-repository.interface";
import { QueryOptions } from "mongoose";

export interface ISipInstallmentRepository extends IBaseRepository<SipInstallmentEntity> {
    findActiveDueSips(): Promise<SipInstallmentEntity[] | null>;
    markFailed(installmentId: string, reason: string): Promise<void>;
    markSuccess(installmentId: string, investmentId: string): Promise<void>;
    findInstallmentsByUser(userId: string, options?: QueryOptions): Promise<SipInstallmentEntity[] | null>;
    findInstallmentsBySip(userId: string, sipId: string): Promise<SipInstallmentEntity[] | null>;
}