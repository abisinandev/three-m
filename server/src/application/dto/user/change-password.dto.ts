import {
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  ValidateIf,
} from "class-validator";
export class ChangePasswordDTO {
  @IsString()
  @IsNotEmpty({ message: "Old password is required" })
  currentPassword!: string;

  @IsString()
  @MinLength(6, { message: "New password must be at least 6 characters" })
  @MaxLength(50, { message: "New password must be below 50 characters" })
  @IsNotEmpty({ message: "New password is required" })
  newPassword!: string;

  @ValidateIf((o) => o.newPassword !== undefined)
  @IsString()
  @IsNotEmpty({ message: "Confirm password is required" })
  confirmPassword!: string;
}
