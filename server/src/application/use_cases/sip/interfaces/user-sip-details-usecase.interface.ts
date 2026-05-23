import { SipDto } from "@application/dto/sip/sip-response.dto";
import { QueryOptions } from "mongoose";

export interface IUserSipDetailsUseCase {
    execute(data: QueryOptions, userId: string): Promise<{
        data: SipDto[],
        page: number,
        limit: number,
        totalCount: number,
    }>;
}