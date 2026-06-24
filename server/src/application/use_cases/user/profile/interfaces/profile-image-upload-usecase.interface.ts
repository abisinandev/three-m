import { UploadProfileImageDTO } from "@application/dto/user/upload-profile-image.dto";

export interface IProfileImageUploadUseCase {
    execute(userId: string, data: UploadProfileImageDTO): Promise<void>;
}