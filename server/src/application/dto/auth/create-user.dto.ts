import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from "class-validator";

export class CreateUserDTO {
  @IsNotEmpty({ message: "Full name is required." })
  @IsString({ message: "Full name must be a valid string." })
  @Matches(/^[A-Za-z ]+$/, {
    message: "Full name can only contain letters and spaces."
  })
  fullName!: string;

  @IsNotEmpty({ message: "Email is required." })
  @IsEmail({}, { message: "Please enter a valid email address." })
  email!: string;

  @IsNotEmpty({ message: "Phone number is required." })
  @IsString({ message: "Phone number must be a string." })
  @Matches(/^(?!([0-9])\1{9}$)[6-9]\d{9}$/, {
    message: "Please enter a valid mobile number."
  })
  phone!: string;

  @IsNotEmpty({ message: "Password is required." })
  @MinLength(8, { message: "Password must be at least 8 characters long." })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#()_\-+=])[A-Za-z\d@$!%*?&^#()_\-+=]{8,}$/,
    {
      message:
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
    })
  password!: string;

  @IsNotEmpty({ message: "Confirm password is required." })
  @MinLength(8, {
    message: "Confirm password must be at least 8 characters long.",
  })
  confirmPassword!: string;
}
