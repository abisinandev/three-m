import type { CreateUserDTO } from "@application/dto/auth/create-user.dto";
import type { SignupResponseDTO } from "@application/dto/auth/signup-response.dto";

export interface IUserSignupUseCase {
  execute(user: CreateUserDTO): Promise<SignupResponseDTO>;
}
