import { IsString, IsNotEmpty } from "class-validator";

export class WatchlistDTO {
  @IsString()
  @IsNotEmpty()
  symbol!: string;
}
