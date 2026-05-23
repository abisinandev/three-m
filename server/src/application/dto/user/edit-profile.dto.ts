import { IsOptional, IsString, IsEmail } from "class-validator";

export class EditProfileDto {
    @IsOptional()
    @IsString()
    fullName?: string;

    @IsOptional()
    @IsString()
    phone?: string;

    @IsOptional()
    @IsEmail()
    email?: string;
}