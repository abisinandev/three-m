import { MutualFundNavEntity } from "@domain/entities/mutual-fund/mutual-fund-nav-entity";
import { IBaseRepository } from "../base-repository.interface";

export interface IMutualFundNavRepository extends IBaseRepository<MutualFundNavEntity> {
    findBySchemeCode(schemeCode: string): Promise<MutualFundNavEntity | null>;
}