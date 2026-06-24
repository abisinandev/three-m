import { inject, injectable } from "inversify";
import { IProfileImageUploadUseCase } from "./interfaces/profile-image-upload-usecase.interface";
import { USER_TYPES } from "@infrastructure/inversify_di/features/user/user.types";
import { UploadProfileImageDTO } from "@application/dto/user/upload-profile-image.dto";
import { IUserRepository } from "@application/interfaces/repositories/user/user-repository.interface";
import { ValidationError } from "@presentation/express/utils/error-handling";
import { ErrorMessages } from "@shared/constants/error.messages";
import { env } from "@presentation/express/utils/constants/env.constants";

@injectable()
export class ProfileImageUploadUseCase implements IProfileImageUploadUseCase {

    constructor(
        @inject(USER_TYPES.UserRepository) private readonly _userRepository: IUserRepository,
    ) { }

    async execute(userId: string, data: UploadProfileImageDTO): Promise<void> {
        if (
            !data.url.startsWith(
                `${env.CLOUDINARY_URLS}${env.CLOUDINARY_CLOUD_NAME}/`
            )
        ) {
            throw new ValidationError(ErrorMessages.VALIDATION.INVALID_IMAGE_URL);
        }
        await this._userRepository.update(userId, { avatar: data.url });
    }
}