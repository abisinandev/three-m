import { IsEmail, IsNotEmpty, Length } from "class-validator";

export class ResetPasswordDTO {
  @IsEmail({}, { message: "Invalid email format" })
  @IsNotEmpty({ message: "Email is required" })
  email!: string;

  @IsNotEmpty({ message: "Reset token is required" })
  resetToken!: string;

  @IsNotEmpty({ message: "Password is required" })
  @Length(6, 50, { message: "Password must be between 6 and 50 characters" })
  password!: string;

  @IsNotEmpty({ message: "Confirm Password is required" })
  @Length(6, 50, {
    message: "Confirm Password must be between 6 and 50 characters",
  })
  confirmPassword!: string;
}
