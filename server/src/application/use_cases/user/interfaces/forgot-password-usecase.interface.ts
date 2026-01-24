import type { ForgotPasswordDTO } from "@application/dto/auth/forgot-password";

export interface IForgotPasswordUseCase {
  execute(data: ForgotPasswordDTO): Promise<void>;
}
