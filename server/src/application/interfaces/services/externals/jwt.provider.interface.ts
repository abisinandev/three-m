import type { JwtPayload } from "jsonwebtoken";

export interface IJwtProvider {
  generateAccessToken(payload: object): string;
  generateRefreshToken(payload: object): string;
  verifyJwtTokens(
    token: string,
    type: "access" | "refresh",
  ): string | JwtPayload;
}
