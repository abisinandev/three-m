import { inject, injectable } from "inversify";
import { ISipBlockUseCase } from "./interfaces/sip-block-usecase.interface";
import { SIP_TYPES } from "@infrastructure/inversify_di/features/sip/sip.types";
import { ISipRepository } from "@application/interfaces/repositories/feature/sip-repository.interface";
import { NotFoundError } from "@presentation/express/utils/error-handling";
import { ErrorMessages } from "@shared/constants/error.messages";
import { SipStatus } from "@domain/enum/funds/sip.enums";

@injectable()
export class SipBlockUseCase implements ISipBlockUseCase {
    constructor(
        @inject(SIP_TYPES.SipRepository) private readonly _sipRepository: ISipRepository,
    ) { }

    async execute(sipId: string): Promise<void> {
        const sip = await this._sipRepository.findById(sipId);
        if (!sip) throw new NotFoundError(ErrorMessages.DB.DATA_NOT_FOUND + "SiP");

        await this._sipRepository.update(sipId, {
            status: SipStatus.SYSTEM_BLOCKED,
            failureReason: "Temporarily blocked due to compliance review."
        });
    }
}