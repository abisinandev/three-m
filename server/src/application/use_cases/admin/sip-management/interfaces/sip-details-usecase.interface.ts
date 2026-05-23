
import { SipDto } from "@application/dto/sip/sip-response.dto";
import { QueryOptions } from "mongoose";

export interface ISipDetailsUseCase {
    execute(sipId: string, options?: QueryOptions): Promise<{
        data: SipDto,
        page: number;
        limit: number;
        totalCount: number;

    }>
}