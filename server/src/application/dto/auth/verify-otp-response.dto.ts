import type { UserDTO } from "../user/user-dto";

export interface VerifyOtpResponseDTO {
  accessToken: string;
  refreshToken: string;
  user?: UserDTO;
}
