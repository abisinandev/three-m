import { MfCagrEntity } from "@domain/entities/mutual-fund/cagr-entity";
import { IBaseRepository } from "../base-repository.interface";
import { ICagrDTO } from "@application/dto/mutual-funds/mf-cagr.dto";

export interface IMfCagrRepository extends IBaseRepository<MfCagrEntity> {
    upsertBySchemeCode(datga: ICagrDTO): Promise<void>;
}