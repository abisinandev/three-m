export interface JwtPayload {
  id: string;
  email: string;
  userCode?: string;
  adminCode?: string;
  isBlocked?: boolean;
  role?: string;
  iat?: number;
  exp?: number;
}
