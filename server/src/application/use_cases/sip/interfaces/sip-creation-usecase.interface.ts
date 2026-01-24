import { SipCreationDTO } from "@application/dto/sip/sip-creation.dto";

export interface ISipCreationUseCase {
    execute(data: SipCreationDTO, userId: string): Promise<void>
}