import { IsNotEmpty, IsNumberString, IsOptional, Length } from "class-validator";

export class Verify2faDTO {
  @IsOptional()
  email!: string;

  @IsNotEmpty()
  @IsNumberString({}, {
    message: "Token must contain only numbers."
  })
  @Length(6, 6, {
    message: "Token must be 6 digits."
  })
  token!: string;
}
