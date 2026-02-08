import { inject, injectable } from "inversify";
import { USER_TYPES } from "@infrastructure/inversify_di/features/user/user.types";
import { IUserRepository } from "@application/interfaces/repositories/user/user-repository.interface";
import { ISipRepository } from "@application/interfaces/repositories/feature/sip-repository.interface";
import { NotFoundError } from "@presentation/express/utils/error-handling";
import { ErrorMessages } from "@shared/constants/error.messages";
import { IResumeSipUseCase } from "./interfaces/resume-sip-usecase.interface";
import { SIP_TYPES } from "@infrastructure/inversify_di/features/sip/sip.types";

@injectable()
export class ResumeSipUseCase implements IResumeSipUseCase {

    constructor(
        @inject(USER_TYPES.UserRepository) private readonly _userRepository: IUserRepository,
        @inject(SIP_TYPES.SipRepository) private readonly _sipRepository: ISipRepository,
    ) { }
    async execute(userId: string, sipId: string): Promise<void> {
        const user = await this._userRepository.findById(userId);
        if (!user) throw new NotFoundError(ErrorMessages.AUTH.USER_NOT_FOUND);

        const sip = await this._sipRepository.findById(sipId);
        if (!sip) throw new NotFoundError(ErrorMessages.DB.DATA_NOT_FOUND + " SIP");

        await this._sipRepository.resume(sipId);
    }
} 