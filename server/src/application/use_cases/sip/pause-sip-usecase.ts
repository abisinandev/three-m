import { inject, injectable } from "inversify";
import { IPauseSipUseCase } from "./interfaces/pause-sip-usecase.interface";
import { USER_TYPES } from "@infrastructure/inversify_di/features/user/user.types";
import { IUserRepository } from "@application/interfaces/repositories/user/user-repository.interface";
import { ISipRepository } from "@application/interfaces/repositories/feature/sip-repository.interface";
import { NotFoundError } from "@presentation/express/utils/error-handling";
import { ErrorMessage } from "@domain/enum/express/messages/error.message";
import { SIP_TYPES } from "@infrastructure/inversify_di/features/sip/sip.types";

@injectable()
export class PauseSipUseCase implements IPauseSipUseCase {

    constructor(
        @inject(USER_TYPES.UserRepository) private readonly _userRepository: IUserRepository,
        @inject(SIP_TYPES.SipRepository) private readonly _sipRepository: ISipRepository,
    ) { }
    async execute(userId: string, sipId: string): Promise<void> {
        const user = await this._userRepository.findById(userId);
        if (!user) throw new NotFoundError(ErrorMessage.USER_NOT_FOUND);

        const sip = await this._sipRepository.findById(sipId);
        if (!sip) throw new NotFoundError(ErrorMessage.NOT_FOUND + "SIP");

        await this._sipRepository.pause(sipId);
    }
}