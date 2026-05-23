import { EditProfileDto } from "@application/dto/user/edit-profile.dto";

export interface IEditProfileUseCase {
    execute(userId: string, data: EditProfileDto): Promise<void>
}