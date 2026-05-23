import type { UserMeResponseDTO } from "@application/dto/user/user-me-response.dto";

export interface IUserProfileInterface {
  execute(data: { userId: string }): Promise<UserMeResponseDTO>;
}
