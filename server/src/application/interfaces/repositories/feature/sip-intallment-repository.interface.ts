import { SipInstallmentEntity } from "@domain/entities/mutual-fund/sip-intallment.entity";
import { IBaseRepository } from "../base-repository.interface";
import { ClientSession, QueryOptions } from "mongoose";

export interface ISipInstallmentRepository extends IBaseRepository<SipInstallmentEntity> {
    findActiveDueSips(): Promise<SipInstallmentEntity[] | null>;
    markFailed(installmentId: string, reason: string): Promise<void>;
    markSuccess(installmentId: string, investmentId: string): Promise<void>;
    findInstallmentsByUser(userId: string, options?: QueryOptions): Promise<SipInstallmentEntity[] | null>;
    countInstallments(userId: string, options?: QueryOptions): Promise<number>;
    findInstallmentsBySip(userId: string, sipId: string): Promise<SipInstallmentEntity[] | null>;
    findActiveAndPendingInstallments(userId: string, sipId: string, session: ClientSession): Promise<SipInstallmentEntity[]>;
}