import type { IJwtProvider } from "@application/interfaces/services/externals/jwt.provider.interface";
import { env } from "@presentation/express/utils/constants/env.constants";
import jwt, { type Secret } from "jsonwebtoken";

export class JwtProvider implements IJwtProvider {
  private readonly accessSecret: Secret = env.ACCESS_SECRET;
  private readonly refreshSecret: Secret = env.REFRESH_SECRET;

  generateAccessToken(payload: object): string {
    console.log(env.ACCESS_EXPIRES_IN, env.REFRESH_EXPIRES_IN);
    return jwt.sign(payload, this.accessSecret, {
      expiresIn: Number(env.ACCESS_EXPIRES_IN),
    });
  }

  generateRefreshToken(payload: object): string {
    return jwt.sign(payload, this.refreshSecret, {
      expiresIn: Number(env.REFRESH_EXPIRES_IN),
    });
  }

  verifyJwtTokens(
    token: string,
    type: "access" | "refresh",
  ): string | jwt.JwtPayload {
    const secret = type === "access" ? this.accessSecret : this.refreshSecret;
    return jwt.verify(token, secret);
  }
}
