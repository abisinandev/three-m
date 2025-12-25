import "express-serve-static-core";

declare module "express-serve-static-core" {
  interface Request {
    user?: {
      id: string;
      userCode?: string;
      email: string;
      role?: string;
    };
  }
}
