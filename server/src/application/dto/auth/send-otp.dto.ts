export interface OtpDTO {
  otp: string;
  email: string;
  expiresAt: number;
  resendCount: number;
  lastResendAt: number;
}
