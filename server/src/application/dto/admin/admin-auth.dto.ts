import { IsEmail, IsString, MinLength, ValidateIf } from "class-validator";

export class AdminAuthDTO {
  @ValidateIf((o) => !o.adminCode)
  @IsEmail({}, { message: "Invalid email format" })
  email!: string;

  @ValidateIf((o) => !o.email)
  @IsString({ message: "Admin Code must be a string" })
  adminCode!: string;

  @IsString({ message: "Password is required" })
  @MinLength(6, { message: "Password must be at least 6 characters" })
  password!: string;
}
