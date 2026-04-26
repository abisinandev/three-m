import type { LoginReponseDTO } from "@application/dto/auth/login-response.dto";
import type { UserLoginDTO } from "@application/dto/auth/user-login.dto";

export interface IUserLoginUseCase {
  execute(user: UserLoginDTO): Promise<LoginReponseDTO>;
}
