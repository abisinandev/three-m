export interface ITwoFactorAuthVerify {
  verify(secret: string, token: string): Promise<boolean>;
}
