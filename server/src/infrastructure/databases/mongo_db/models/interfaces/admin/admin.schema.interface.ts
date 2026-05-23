import type { Role } from "@domain/enum/users/user-role.enum";

export interface IAdminSchema {
  _id: string; 
  adminCode: string;
  fullName: string;
  email: string;
  password: string;
  role: Role; 
  permissions?: string | null; 
  isBlocked?: boolean;
  profile?: string | null; 
  createdAt?: Date | null;
  updatedAt?: Date | null;
}