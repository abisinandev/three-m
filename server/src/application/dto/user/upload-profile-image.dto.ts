import { IsOptional } from "class-validator";

export class UploadProfileImageDTO{
    @IsOptional()
    userId!: string;
    @IsOptional()
    url!: string;
}