export interface ResendOtpResponseDTO {
  expiresAt: number;
  resendCount: number;
  accessToken?: string;
  refreshToken?: string;
}
