export interface ITwoFactorAuthSetup {
  setTwoFactor(
    email: string,
    appName: string,
  ): Promise<{ secret: string; qrCode: string }>;
}
