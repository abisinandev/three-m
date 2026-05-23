import { IsEmail } from "class-validator";

export class ResendOtpDTO {
  @IsEmail()
  email!: string;
}
