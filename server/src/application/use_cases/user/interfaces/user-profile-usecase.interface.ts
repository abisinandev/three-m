import type { UserDTO } from "@application/dto/user/user-dto";

export interface IUserProfileInterface {
  execute(data: { userId: string }): Promise<UserDTO>;
}
