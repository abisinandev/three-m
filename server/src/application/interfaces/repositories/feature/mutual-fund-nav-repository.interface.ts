import { MutualFundNavEntity } from "@domain/entities/mutual-fund/mutual-fund-nav-entity";
import { IBaseRepository } from "../base-repository.interface";
import { MutualFundNavDTO } from "@application/dto/mutual-funds/mutual-fund-nav-dto";
import { NavInterval } from "@domain/enum/funds/nav-intervals.enums";
import { ClientSession } from "mongoose";
import { NavHistoryDTO } from "@application/dto/mutual-funds/nav-histroy.dto";

export interface IMutualFundNavRepository extends IBaseRepository<MutualFundNavEntity> {
    findBySchemeCode(schemeCode: string, session?: ClientSession): Promise<MutualFundNavEntity | null>;
    upsertDocument(data: MutualFundNavDTO): Promise<void>;
    findByInterval(schemeCode: string, interval: NavInterval, limit: 300): Promise<MutualFundNavEntity[] | null>;
    getLatestNav(schemeCode: string): Promise<MutualFundNavEntity | null>;
    bulkUpsertNavs(navs: NavHistoryDTO[]): Promise<void>;
}