import { IsNotEmpty, IsString, IsUrl } from "class-validator";

export class UploadProfileImageDTO {
    @IsString()
    @IsNotEmpty()
    @IsUrl()
    url!: string;
}