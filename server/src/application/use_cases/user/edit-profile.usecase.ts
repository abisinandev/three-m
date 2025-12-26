import { EditProfileDto } from "@application/dto/user/edit-profile.dto";
import { IEditProfileUseCase } from "../interfaces/user/edit-profile-usecase.interface";
import { inject, injectable } from "inversify";
import { USER_TYPES } from "@infrastructure/inversify_di/types/user/user.types";
import { UserRepository } from "@infrastructure/databases/repository/user/user.repository";
import { ValidationError } from "@presentation/express/utils/error-handling";
import { ErrorMessage } from "@domain/enum/express/messages/error.message";

@injectable()
export class EditProfileUseCase implements IEditProfileUseCase {
    constructor(
        @inject(USER_TYPES.UserRepository) private readonly _userRepository: UserRepository,
    ) { }

    async execute(userId: string, data: EditProfileDto): Promise<void> {

        const filteredData = Object.fromEntries(
            Object.entries(data).filter(([_, value]) => value !== undefined)
        );

        console.log("FilteredData :", filteredData);

        if (Object.keys(filteredData).length === 0) {
            throw new ValidationError(ErrorMessage.PROFILE_UPDATION_FAILED);
        }

        const user = await this._userRepository.update(userId, filteredData);
        console.log("user; ,", user);
    }
}