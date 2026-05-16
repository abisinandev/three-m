import { SipCreationDTO } from "@application/dto/sip/sip-creation.dto";

export interface ISipCreationUseCase {
    execute(data: SipCreationDTO, userId: string, idempotencyKey: string): Promise<undefined | { message: string, upgrade: boolean }>;
}