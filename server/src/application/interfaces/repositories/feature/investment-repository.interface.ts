import { InvestmentEntity } from "@domain/entities/mutual-fund/investment.entity";
import { IBaseRepository } from "../base-repository.interface";
import { ClientSession, QueryOptions } from "mongoose";
import { GroupedSchemeInvestments } from "@application/dto/portfolio/grouped-scheme-investments ";
import { InvestmentRedeemResult } from "@domain/types/radeem-units.types";

export interface IInvestmentRepository extends IBaseRepository<InvestmentEntity> {
    findInitiatedFunds(): Promise<InvestmentEntity[] | null>;
    allotNav(data: {
        investmentId: string;
        nav: number;
        navDate: Date;
        units: number;
    }): Promise<void>;

    countByUser(userId: string): Promise<number>;
    findByUsertotalInvestments(userId: string): Promise<number>;
    findInvestmentsByUser(userId: string): Promise<InvestmentEntity[] | null>;
    getUserInvestments(userId: string, query: QueryOptions): Promise<InvestmentEntity[]>;
    getTotalUnitsByUser(userId: string): Promise<number>;
    getTotalUnitsByUserAndScheme(userId: string, schemeCode: string): Promise<InvestmentEntity[]>
    findGroupedInvestmentsByUser(userId: string): Promise<GroupedSchemeInvestments[] | null>;
    getInvestmentForRadeem(userId: string, schemeCode: string): Promise<InvestmentEntity | null>;
    redeemInvestments(
        investmentId: string,
        userId: string,
        update: InvestmentRedeemResult,
        session: ClientSession
    ): Promise<void>;
    createInvestment(entity: InvestmentEntity): Promise<InvestmentEntity | null>;

}