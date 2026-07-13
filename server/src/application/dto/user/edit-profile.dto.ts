import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
} from "class-validator";

export class EditProfileDto {
  @IsOptional()
  @IsString({ message: "Full name must be a string." })
  @IsNotEmpty({ message: "Full name cannot be empty." })
  @Length(2, 50, {
    message: "Full name must be between 2 and 50 characters.",
  })
  fullName?: string;

  @IsOptional()
  @IsString({ message: "Phone number must be a string." })
  @Matches(/^[6-9]\d{9}$/, {
    message: "Please enter a valid 10-digit phone number.",
  })
  phone?: string;

  @IsOptional()
  @IsNotEmpty({ message: "Email cannot be empty." })
  @IsEmail({}, {
    message: "Please provide a valid email address.",
  })
  email?: string;
}