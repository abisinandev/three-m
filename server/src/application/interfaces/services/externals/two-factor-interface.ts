export interface ITwoFactorAuthService {
  setUp2faAuth(email: string): Promise<{ secret: string; qrCode: string }>;
  verify2faAuth(
    email: string,
    token: string,
  ): Promise<{ accessToken: string; refreshToken: string }>;
}
