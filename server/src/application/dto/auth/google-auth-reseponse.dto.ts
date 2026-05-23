import type { UserEntity } from "@domain/entities/user/user.entity";

export interface GoogleResponseDTO {
  accessToken: string;
  refreshToken: string;
  user: UserEntity;
}
