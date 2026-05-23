import type { GoogleAuthDTO } from "@application/dto/auth/google-auth.dto";

export interface IGoogleAuthService {
  verifyToken(token: string): Promise<GoogleAuthDTO>;
}
