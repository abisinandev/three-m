import { IsNotEmpty, IsOptional, Length } from "class-validator";

export class Verify2faDTO {
  @IsOptional()
  email!: string;
  @IsNotEmpty()
  @Length(6, 6)
  token!: string;
}
