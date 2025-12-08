import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
} from "class-validator";

export class CreateUserDTO {
  @IsNotEmpty({ message: "Full name is required." })
  @IsString({ message: "Full name must be a valid string." })
  fullName!: string;

  @IsEmail({}, { message: "Please enter a valid email address." })
  email!: string;

  @IsNotEmpty({ message: "Phone number is required." })
  @IsString({ message: "Phone number must be a string." })
  phone!: string;

  @IsNotEmpty({ message: "Password is required." })
  @MinLength(8, { message: "Password must be at least 8 characters long." })
  password!: string;

  @IsNotEmpty({ message: "Confirm password is required." })
  @MinLength(8, {
    message: "Confirm password must be at least 8 characters long.",
  })
  confirmPassword!: string;

  @IsString({ message: "Role must be a valid string." })
  role: string = "user";
}
