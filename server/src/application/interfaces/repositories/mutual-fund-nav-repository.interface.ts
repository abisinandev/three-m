import { MutualFundNavEntity } from "@domain/entities/mutual-fund-nav-entity";
import { IBaseRepository } from "./base-repository.interface";
import { MutualFundWithLatestNav } from "@infrastructure/mappers/mutual-fund.mapper";

export interface IMutualFundNavRepository extends IBaseRepository<MutualFundNavEntity> {
    findBySchemeCode(schemeCode: string): Promise<MutualFundWithLatestNav | null>;
}