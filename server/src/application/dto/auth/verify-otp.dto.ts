import {
  IsEmail,
  IsNotEmpty,
  Matches,
} from "class-validator";

export class VerifyOtpDTO {
  @IsNotEmpty({ message: "Email is required." })
  @IsEmail({}, { message: "Please provide a valid email address." })
  @Matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/, {
    message: "Email format is invalid.",
  })
  email!: string;

  @IsNotEmpty({ message: "OTP is required." })
  @Matches(/^\d{6}$/, {
    message: "OTP must be a 6-digit number.",
  })
  otp!: string;
}
