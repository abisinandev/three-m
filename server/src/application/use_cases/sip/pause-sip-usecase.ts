import { inject, injectable } from "inversify";
import { IPauseSipUseCase } from "./interfaces/pause-sip-usecase.interface";
import { USER_TYPES } from "@infrastructure/inversify_di/features/user/user.types";
import { IUserRepository } from "@application/interfaces/repositories/user/user-repository.interface";
import { ISipRepository } from "@application/interfaces/repositories/feature/sip-repository.interface";
import { NotFoundError, UnauthorizedError, ValidationError } from "@presentation/express/utils/error-handling";
import { ErrorMessages } from "@shared/constants/error.messages";
import { SIP_TYPES } from "@infrastructure/inversify_di/features/sip/sip.types";
import { SipStatus } from "@domain/enum/funds/sip.enums";

@injectable()
export class PauseSipUseCase implements IPauseSipUseCase {

    constructor(
        @inject(USER_TYPES.UserRepository) private readonly _userRepository: IUserRepository,
        @inject(SIP_TYPES.SipRepository) private readonly _sipRepository: ISipRepository,
    ) { }
    async execute(userId: string, sipId: string): Promise<void> {
        const user = await this._userRepository.findById(userId);
        if (!user) throw new NotFoundError(ErrorMessages.AUTH.USER_NOT_FOUND);

        const sip = await this._sipRepository.findById(sipId);
        if (!sip) throw new NotFoundError(`${ErrorMessages.DB.DATA_NOT_FOUND} SIP`);

        if (sip.userId !== userId) {
            throw new UnauthorizedError(ErrorMessages.SIP.UNAUTHORIZED_ACCESS);
        }

        if (sip.status === SipStatus.PAUSED) return;

        if (sip.status === SipStatus.CANCELLED) {
            throw new ValidationError(ErrorMessages.SIP.ALREADY_CANCELLED);
        }

        if (sip.status === SipStatus.COMPLETED) {
            throw new ValidationError(ErrorMessages.SIP.ALREADY_COMPLETED);
        }

        if (sip.status !== SipStatus.ACTIVE) {
            throw new ValidationError(ErrorMessages.SIP.ONLY_ACTIVE_SIP);
        }

        await this._sipRepository.pause(sipId);
    }
}