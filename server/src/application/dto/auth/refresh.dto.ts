import { IsString } from "class-validator";

export class RefreshDTO {
  @IsString({ message: "Refresh token is required" })
  refreshToken!: string;
}
