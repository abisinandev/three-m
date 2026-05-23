import type { IEmailService } from "@application/interfaces/services/externals/email.service.interface";
import { env } from "@presentation/express/utils/constants/env.constants";
import nodemailer from "nodemailer";
import { otpEmailTemplate } from "./templates/otp-email-template";

export class NodeMailerService implements IEmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: env.EMAIL_USER,
        pass: env.EMAIL_PASS,
      },
    });
  }

  async sendOtpEmail(to: string, otp: string) {
    await this.transporter.sendMail({
      from: `"three-m" <${env.EMAIL_USER}>`,
      to,
      subject: "Email Verification OTP",
      html: otpEmailTemplate(otp),
    });
  }
}
