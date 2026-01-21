import { SipInstallmentDto } from "@application/dto/sip/sip-installment.dto";
import { QueryOptions } from "mongoose";

export interface ISipDetailsUseCase {
    execute(sipId: string, userId: string, options?: QueryOptions): Promise<SipInstallmentDto[]>
}