import { IsNotEmpty, IsOptional, IsString, Matches } from "class-validator";

export class UserLoginDTO {
  @IsOptional()
  @IsString({ message: "User code must be a string." })
  @IsNotEmpty({ message: "User code cannot be empty." })
  @Matches(/^[A-Z]{3}[A-Z]?\d{3}$/, {
    message:
      "User code must be in the format: 3–4 uppercase letters followed by 3 digits (e.g., USRX391).",
  })
  userCode?: string;

  @IsOptional()
  @IsString({ message: "Email must be a valid string." })
  @IsNotEmpty({ message: "Email cannot be empty." })
  @Matches(/^[\w.]+@([\w-]+\.)+[\w-]{2,4}$/, {
    message: "Email must be a valid email address.",
  })
  email?: string;

  @IsNotEmpty({ message: "Password is required." })
  @IsString({ message: "Password must be a string." })
  password!: string;
}
