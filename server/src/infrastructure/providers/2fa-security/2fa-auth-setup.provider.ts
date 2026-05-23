import type { ITwoFactorAuthSetup } from "@application/interfaces/services/externals/2fa-auth-setup.interface";
import { injectable } from "inversify";
import { authenticator } from "otplib";
import qrcode from "qrcode";

@injectable()
export class TwoFactorAuthSetup implements ITwoFactorAuthSetup {
  async setTwoFactor(
    email: string,
    appName: string = "three_M",
  ): Promise<{ secret: string; qrCode: string }> {
    const secret = await authenticator.generateSecret();
    const otpAuth = await authenticator.keyuri(email, appName, secret);
    const qrCode = await qrcode.toDataURL(otpAuth);
    return { secret, qrCode };
  }
}
