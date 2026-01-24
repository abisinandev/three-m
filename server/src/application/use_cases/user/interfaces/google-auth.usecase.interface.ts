import type { GoogleResponseDTO } from "@application/dto/auth/google-auth-reseponse.dto";

export interface IGoogleAuthUseCase {
  execute(data: {
    provider: "google";
    token: string;
  }): Promise<GoogleResponseDTO>;
}
