export interface BaseResponseDTO<T = unknown> {
  success: boolean;
  message: string;
  statusCode: number;
  data?: T | null;
  requires2FASetup?: boolean;
}
