import type { ResetPasswordDTO } from "@application/dto/auth/reset-password";

export interface IResetPasswordUseCase {
  execute(data: ResetPasswordDTO): Promise<void>;
}
