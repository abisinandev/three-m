import { inject, injectable } from "inversify";
import { IProfileImageUploadUseCase } from "../../interfaces/user/profile-image-upload-usecase.interface";
import { USER_TYPES } from "@infrastructure/inversify_di/types/user/user.types";
import { UploadProfileImageDTO } from "@application/dto/user/upload-profile-image.dto";
import { IUserRepository } from "@application/interfaces/repositories/user/user-repository.interface";

@injectable()
export class ProfileImageUploadUseCase implements IProfileImageUploadUseCase {
    constructor(
        @inject(USER_TYPES.UserRepository) private readonly _userRepository: IUserRepository,
    ) { }

    async execute(data: UploadProfileImageDTO): Promise<void> {
        await this._userRepository.update(data.userId, { avatar: data.url });
    }
}