import type { GoogleAuthDTO } from "@application/dto/auth/google-auth.dto";
import type { IGoogleAuthService } from "@application/interfaces/services/externals/google-auth.service.interface";
import { ErrorMessages } from "@shared/constants/error.messages";
import { env } from "@presentation/express/utils/constants/env.constants";
import { ValidationError } from "@presentation/express/utils/error-handling";
import { OAuth2Client } from "google-auth-library";

export class GoogleAuthService implements IGoogleAuthService {
  private client: OAuth2Client;

  constructor() {
    const clientId = env.GOOGLE_AUTH_CLIENT_ID;
    if (!clientId) throw new ValidationError("GOOGLE_CLIENT_ID missing");
    this.client = new OAuth2Client(clientId);
  }

  async verifyToken(token: string): Promise<GoogleAuthDTO> {
    const ticket = await this.client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) throw new ValidationError(ErrorMessages.AUTH.INVALID_CREDENTIALS);

    return {
      id: payload.sub,
      email: payload.email || "",
      name: payload.name || payload.given_name || "User",
      avatar: payload.picture,
      emailVerified: payload.email_verified === true,
    };
  }
}
