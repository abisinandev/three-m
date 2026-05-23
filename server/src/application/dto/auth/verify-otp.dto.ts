import { IsEmail, IsNotEmpty, IsOptional, Length } from "class-validator";

export class VerifyOtpDTO {
  @IsEmail()
  @IsOptional()
  email!: string;

  @IsNotEmpty()
  @Length(6, 6)
  otp!: string;
}
