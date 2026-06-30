import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  ValidateIf,
} from "class-validator";

export class ChangePasswordDTO {
  @IsString()
  @IsNotEmpty({ message: "Current password is required" })
  currentPassword!: string;

  @IsString()
  @MinLength(6, { message: "New password must be at least 6 characters" })
  @MaxLength(50, { message: "New password must be below 50 characters" })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_\-+=])[A-Za-z\d@$!%*?&#^()_\-+=]{6,50}$/,
    {
      message:
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    }
  )
  @IsNotEmpty({ message: "New password is required" })
  newPassword!: string;

  @ValidateIf((o) => o.newPassword !== undefined)
  @IsString()
  @IsNotEmpty({ message: "Confirm password is required" })
  confirmPassword!: string;
}