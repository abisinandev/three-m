import type { ChangePasswordDTO } from "@application/dto/user/change-password.dto";

export interface IChangePasswordUseCase {
  execute(data: { userId: string; data: ChangePasswordDTO }): Promise<void>;
}
