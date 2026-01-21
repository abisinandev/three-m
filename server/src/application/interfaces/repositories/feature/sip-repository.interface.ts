import { SipEntity } from "@domain/entities/mutual-fund/sip.entity";
import { IBaseRepository } from "../base-repository.interface";
import { ClientSession, QueryOptions } from "mongoose";

export interface ISipRepository extends IBaseRepository<SipEntity> {
    createSip(entity: SipEntity, session: ClientSession): Promise<SipEntity | null>
    fetchAllSips(options: QueryOptions): Promise<SipEntity[]>
    findActiveSips(): Promise<{ totalActiveSips: number, datas: SipEntity[] }>
}