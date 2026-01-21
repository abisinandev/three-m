import { SipDto } from "@application/dto/sip/sip-response.dto";
import { QueryOptions } from "mongoose";

export interface ISipManagementUseCase {
    execute(query: QueryOptions): Promise<{
        data: SipDto[],
        page: number,
        limit: number,
        totalCount: number, 
        totalActiveSips: number
    }>;
}