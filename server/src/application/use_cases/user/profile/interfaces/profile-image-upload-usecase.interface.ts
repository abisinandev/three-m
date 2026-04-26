import { UploadProfileImageDTO } from "@application/dto/user/upload-profile-image.dto";

export interface IProfileImageUploadUseCase {
    execute(data: UploadProfileImageDTO): Promise<void>;
}